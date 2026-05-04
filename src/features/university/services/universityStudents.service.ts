// features/university/services/universityStudents.service.ts
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";

// ========================== Interfaces ==========================
export interface UniversityStudent {
  id: string;
  university_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  speciality: string;
  speciality_type: string;
  academic_year: string;
  group_number: string;
  section: string;
}

export interface PlatformStudent {
  id: string;                // profile id
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  speciality: string;
  speciality_type: string;
  academic_year?: string;
  is_profile_verified: boolean;
  connection_status: 'none' | 'pending' | 'connected' | 'rejected';
  rejection_reason?: string; // not stored, only for email
}

export interface MatchResult {
  matched: boolean;
  matchScore: number;
  mismatchedFields: string[];
  officialRecord?: UniversityStudent;
}

export interface InvitationRequest {
  studentId: string;         // profile id of student
  officialStudentId: string; // id from university_students (not used in DB, kept for reference)
  departmentId: string;      // university profile id (university admin)
  invitedBy: string;         // admin profile id
}

export interface RejectionData {
  studentId: string;
  reason: string;
  email: string;
  studentName: string;
  universityId: string;      // university profile id
}

// ========================== Service Class ==========================
class UniversityStudentsService {

// ---------- Excel Parsing ----------
async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
  
          // Map columns exactly as they appear: id_card, full_name, speciality_type, academic_year, group, section
          const mapped = json.map((row: any) => ({
            student_id: row.id_card?.toString() || '',
            first_name: row.first_name || '',
            last_name: row.last_name || '',
            speciality: row.speciality || '',
            speciality_type: row.speciality_type || '',
            academic_year: row.academic_year?.toString() || '',
          }));
          resolve(mapped);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  async previewExcelFile(file: File): Promise<any[]> {
    return this.parseExcelFile(file);
  }
  async upsertOfficialStudents(universityId: string, students: any[]): Promise<{ inserted: number; updated: number }> {
    if (students.length === 0) throw new Error('No student data provided');

    // Fetch existing student_ids for this university to detect duplicates
    const { data: existing, error: fetchError } = await supabase
      .from('university_students')
      .select('student_id')
      .eq('university_id', universityId);

    if (fetchError) throw new Error(fetchError.message);

    const existingIds = new Set(existing?.map(e => e.student_id) || []);

    let inserted = 0;
    let updated = 0;

    for (const s of students) {
      const record = {
        university_id: universityId,
        student_id: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        speciality: s.speciality,
        speciality_type: s.speciality_type,
        academic_year: s.academic_year,
      };

      if (existingIds.has(s.student_id)) {
        // Update existing record
        const { error } = await supabase
          .from('university_students')
          .update(record)
          .eq('university_id', universityId)
          .eq('student_id', s.student_id);
        if (!error) updated++;
        else console.error('Update error for', s.student_id, error);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('university_students')
          .insert(record);
        if (!error) inserted++;
        else console.error('Insert error for', s.student_id, error);
      }
    }

    return { inserted, updated };
  }
  // ---------- Upload Official Database (from Excel) ----------
  async uploadOfficialStudents(universityId: string, file: File): Promise<void> {
    const students = await this.parseExcelFile(file);
    if (students.length === 0) throw new Error('No valid data found in file');
    console.log('Parsed students:', students);
  
    const { error } = await supabase
      .from('university_students')
      .insert(students.map((s) => ({
        university_id: universityId,
        student_id: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        speciality: s.speciality,
        speciality_type: s.speciality_type,
        academic_year: s.academic_year,
      })));
  
    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }
  }

  // ---------- Fetch Official Students ----------
  async getOfficialStudents(universityId: string): Promise<UniversityStudent[]> {
    const { data, error } = await supabase
      .from('university_students')
      .select('*')
      .eq('university_id', universityId);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // ---------- Fetch Registered Platform Students (verified students) ----------
  async getRegisteredStudents(universityId: string): Promise<PlatformStudent[]> {
    // 1. Get all verified students (role='student' and is_verified=true)
    const { data: students, error } = await supabase
      .from('profiles')
      .select(`
        id,
        student_id,
        email,
        first_name,
        last_name,
        speciality,
        speciality_type,
        academic_year,
        is_verified
      `)
      .eq('role', 'student')
      .eq('is_verified', true);

    if (error) throw new Error(error.message);
    if (!students || students.length === 0) return [];

    // 2. Get connection statuses for these students with this university
    const studentIds = students.map(s => s.id);
    const { data: connections, error: connError } = await supabase
      .from('university_connections')
      .select('student_id, status')
      .eq('university_id', universityId)
      .in('student_id', studentIds);

    if (connError) throw new Error(connError.message);

    // 3. Map connection status to each student
    const statusMap = new Map<string, string>();
    connections?.forEach(conn => {
      statusMap.set(conn.student_id, conn.status);
    });

    return students.map(student => {
      let connectionStatus: PlatformStudent['connection_status'] = 'none';
      const dbStatus = statusMap.get(student.id);
      if (dbStatus === 'pending') connectionStatus = 'pending';
      else if (dbStatus === 'accepted') connectionStatus = 'connected';
      else if (dbStatus === 'rejected') connectionStatus = 'rejected';

      return {
        id: student.id,
        student_id: student.student_id || '',
        email: student.email || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        speciality: student.speciality || '',
        speciality_type: student.speciality_type || '',
        academic_year: student.academic_year || undefined,
        is_profile_verified: student.is_verified || false,
        connection_status: connectionStatus,
        rejection_reason: undefined, // not stored in DB
      };
    });
  }

  // ---------- Compare Student against Official Records ----------
  compareWithOfficial(
    student: PlatformStudent,
    officialRecords: UniversityStudent[]
  ): MatchResult {
    const official = officialRecords.find(rec => rec.student_id === student.student_id);
    if (!official) {
      return {
        matched: false,
        matchScore: 0,
        mismatchedFields: ['Student ID not found in official database'],
        officialRecord: undefined,
      };
    }

    const mismatchedFields: string[] = [];
    let matchScore = 100;

    if (official.speciality.toLowerCase().trim() !== student.speciality.toLowerCase().trim()) {
      mismatchedFields.push('Speciality');
      matchScore -= 25;
    }

    if (student.academic_year && official.academic_year !== student.academic_year) {
      mismatchedFields.push('Academic Year');
      matchScore -= 25;
    }


    return {
      matched: mismatchedFields.length === 0,
      matchScore: Math.max(0, matchScore),
      mismatchedFields,
      officialRecord: official,
    };
  }

  // ---------- Legacy: match a single student ID ----------
  async matchStudent(universityId: string, studentId: string): Promise<UniversityStudent | null> {
    const { data, error } = await supabase
      .from('university_students')
      .select('*')
      .eq('student_id', studentId)
      .eq('university_id', universityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  // ---------- Send Connection Invitation ----------
  async sendInvitation(request: InvitationRequest): Promise<void> {
    // Upsert into university_connections (ensure only one record per student-university pair)
    const { error } = await supabase
      .from('university_connections')
      .upsert({
        student_id: request.studentId,
        university_id: request.departmentId,
        status: 'pending',
        invited_by: request.invitedBy,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'student_id, university_id',
        ignoreDuplicates: false,
      });
    if (error) throw new Error(error.message);
  }

  // ---------- Reject Student (update connection status) ----------
  async rejectStudent(rejection: RejectionData): Promise<void> {
    // Update the connection status to 'rejected'
    const { error } = await supabase
      .from('university_connections')
      .update({ status: 'rejected' })
      .eq('student_id', rejection.studentId)
      .eq('university_id', rejection.universityId);

    if (error) throw new Error(error.message);

    // Send rejection email (optional, but required by spec)
    const { error: emailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: rejection.email,
        subject: 'University Connection Request Update',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Connection Request Update</h2>
            <p>Dear ${rejection.studentName},</p>
            <p>Your connection request to the university department has been reviewed and was not approved at this time.</p>
            <p><strong>Reason for rejection:</strong> ${rejection.reason}</p>
            <p>You can update your profile information and submit a new connection request from your dashboard.</p>
            <p>Best regards,<br/>University Administration</p>
          </div>
        `,
      },
    });
    if (emailError) console.error('Failed to send rejection email:', emailError);
  }

  // ---------- Reset Connection Request (allow student to retry) ----------
  async resetConnectionRequest(studentId: string, universityId: string): Promise<void> {
    // Update status to 'pending' so admin can reconsider
    const { error } = await supabase
      .from('university_connections')
      .update({ status: 'pending' })
      .eq('student_id', studentId)
      .eq('university_id', universityId);
    if (error) throw new Error(error.message);
  }
}

export const universityStudentsService = new UniversityStudentsService();