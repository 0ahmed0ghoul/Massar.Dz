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
  id: string; // profile id
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  speciality: string;
  speciality_type: string;
  academic_year?: string;
  is_profile_verified: boolean;
  connection_status: "none" | "pending" | "connected" | "rejected";
  rejection_reason?: string; // not stored, only for email
}

export interface MatchResult {
  matched: boolean;
  matchScore: number;
  mismatchedFields: string[];
  officialRecord?: UniversityStudent;
}

export interface InvitationRequest {
  studentId: string; // profile id of student
  officialStudentId: string; // id from university_students (not used in DB, kept for reference)
  departmentId: string; // university profile id (university admin)
  invitedBy: string; // admin profile id
}

export interface RejectionData {
  studentId: string;
  reason: string;
  email: string;
  studentName: string;
  universityId: string; // university profile id
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
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);

          // Map columns exactly as they appear: id_card, full_name, speciality_type, academic_year, group, section
          const mapped = json.map((row: any) => ({
            student_id: row.id_card?.toString() || "",
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            speciality: row.speciality || "",
            speciality_type: row.speciality_type || "",
            academic_year: row.academic_year?.toString() || "",
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
  async upsertOfficialStudents(
    universityId: string,
    students: any[]
  ): Promise<{ inserted: number; updated: number }> {
    if (students.length === 0) throw new Error("No student data provided");

    // Fetch existing student_ids for this university to detect duplicates
    const { data: existing, error: fetchError } = await supabase
      .from("university_students")
      .select("student_id")
      .eq("university_id", universityId);

    if (fetchError) throw new Error(fetchError.message);

    const existingIds = new Set(existing?.map((e) => e.student_id) || []);

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
          .from("university_students")
          .update(record)
          .eq("university_id", universityId)
          .eq("student_id", s.student_id);
        if (!error) updated++;
        else console.error("Update error for", s.student_id, error);
      } else {
        // Insert new record
        const { error } = await supabase
          .from("university_students")
          .insert(record);
        if (!error) inserted++;
        else console.error("Insert error for", s.student_id, error);
      }
    }

    return { inserted, updated };
  }
  // ---------- Upload Official Database (from Excel) ----------
  async uploadOfficialStudents(
    universityId: string,
    file: File
  ): Promise<void> {
    const students = await this.parseExcelFile(file);
    if (students.length === 0) throw new Error("No valid data found in file");
    console.log("Parsed students:", students);

    const { error } = await supabase.from("university_students").insert(
      students.map((s) => ({
        university_id: universityId,
        student_id: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        speciality: s.speciality,
        speciality_type: s.speciality_type,
        academic_year: s.academic_year,
      }))
    );

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }
  }

  // ---------- Fetch Official Students ----------
  async getOfficialStudents(
    universityId: string
  ): Promise<UniversityStudent[]> {
    const { data, error } = await supabase
      .from("university_students")
      .select("*")
      .eq("university_id", universityId);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // ---------- Fetch Registered Platform Students ----------

  async getRegisteredStudents(
    universityName: string
  ): Promise<PlatformStudent[]> {
    console.log("🔍 Fetching registered students for university:", universityName);
    
    // First, try exact match
    let { data: students, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          student_id,
          email,
          first_name,
          last_name,
          speciality,
          speciality_type,
          academic_year,
          is_verified,
          avatar_url,
          university_connection_status,
          university_name,
          role,
          candidate_type
        `
      )
      .eq("role", "student")
      .eq("university_name", universityName);
  
    if (error) {
      console.error("❌ Error fetching students:", error);
      throw new Error(error.message);
    }
  
    console.log("📊 Exact match students count:", students?.length);
  
    // If no exact matches, try case-insensitive search
    if (!students || students.length === 0) {
      console.log("🔍 Trying case-insensitive search...");
      
      const { data: studentsILike, error: likeError } = await supabase
        .from("profiles")
        .select(
          `
            id,
            student_id,
            email,
            first_name,
            last_name,
            speciality,
            speciality_type,
            academic_year,
            is_verified,
            avatar_url,
            university_connection_status,
            university_name,
            role,
            candidate_type
          `
        )
        .eq("role", "student")
        .ilike("university_name", universityName);
  
      if (likeError) {
        console.error("❌ Error in case-insensitive search:", likeError);
      } else {
        console.log("📊 Case-insensitive match students count:", studentsILike?.length);
        students = studentsILike;
      }
    }
  
    // If still no matches, try fetching by connection
    if (!students || students.length === 0) {
      console.log("🔍 Trying to find students by department_connections...");
      
      // Get student IDs from department_connections
      const { data: connections } = await supabase
        .from("department_connections")
        .select("student_id")
        .eq("university_id", universityId);
  
      if (connections && connections.length > 0) {
        const studentIds = connections.map(c => c.student_id);
        
        const { data: connectedStudents } = await supabase
          .from("profiles")
          .select(
            `
              id,
              student_id,
              email,
              first_name,
              last_name,
              speciality,
              speciality_type,
              academic_year,
              is_verified,
              avatar_url,
              university_connection_status,
              university_name,
              role,
              candidate_type
            `
          )
          .in("id", studentIds)
          .eq("role", "student");
  
        students = connectedStudents;
        console.log("📊 Students found via connections:", students?.length);
      }
    }
  
    console.log("📊 Final students list:", students);
  
    return (students || []).map((student) => ({
      id: student.id,
      student_id: student.student_id || "",
      email: student.email || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      speciality: student.speciality || "",
      speciality_type: student.speciality_type || "",
      academic_year: student.academic_year || undefined,
      is_profile_verified: student.is_verified || false,
      avatar_url: student.avatar_url || undefined,
      connection_status: (student.university_connection_status as PlatformStudent['connection_status']) || "none",
      rejection_reason: undefined,
    }));
  }
  // ---------- Compare Student against Official Records ----------
  compareWithOfficial(
    student: PlatformStudent,
    officialRecords: UniversityStudent[]
  ): MatchResult {
    const official = officialRecords.find(
      (rec) => rec.student_id === student.student_id
    );
    if (!official) {
      return {
        matched: false,
        matchScore: 0,
        mismatchedFields: ["Student ID not found in official database"],
        officialRecord: undefined,
      };
    }

    const mismatchedFields: string[] = [];
    let matchScore = 100;

    if (
      official.speciality.toLowerCase().trim() !==
      student.speciality.toLowerCase().trim()
    ) {
      mismatchedFields.push("Speciality");
      matchScore -= 25;
    }

    if (
      student.academic_year &&
      official.academic_year !== student.academic_year
    ) {
      mismatchedFields.push("Academic Year");
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
  async matchStudent(
    universityId: string,
    studentId: string
  ): Promise<UniversityStudent | null> {
    const { data, error } = await supabase
      .from("university_students")
      .select("*")
      .eq("student_id", studentId)
      .eq("university_id", universityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  // ---------- Send Connection Invitation ----------
  async sendInvitation(request: InvitationRequest): Promise<void> {
    // Upsert into department_connections (ensure only one record per student-university pair)
    const { error } = await supabase.from("department_connections").upsert(
      {
        student_id: request.studentId,
        university_id: request.departmentId,
        status: "pending",
        invited_by: request.invitedBy,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "student_id, university_id",
        ignoreDuplicates: false,
      }
    );
    if (error) throw new Error(error.message);
  }

  // ---------- Reject Student (update connection status) ----------
// Update rejectStudent in universityStudents.service.ts

async rejectStudent(rejection: RejectionData): Promise<void> {
  // Update the profile's university_connection_status to 'rejected'
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      university_connection_status: "rejected",
    })
    .eq("id", rejection.studentId);

  if (profileError) throw new Error(profileError.message);

  // Update department_connections
  const { error: connError } = await supabase
    .from("department_connections")
    .update({ 
      status: "rejected",
      updated_at: new Date().toISOString()
    })
    .eq("student_id", rejection.studentId)
    .eq("university_id", rejection.universityId);

  if (connError) {
    console.warn("Could not update department_connections:", connError);
  }

  // Send rejection email
  const { error: emailError } = await supabase.functions.invoke(
    "send-email",
    {
      body: {
        to: rejection.email,
        subject: "University Connection Request Update",
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
    }
  );
  if (emailError)
    console.error("Failed to send rejection email:", emailError);
}

async approveStudentConnection(studentId: string, universityName: string): Promise<void> {
  console.log("🚀 approveStudentConnection called with:", { studentId, universityName });

  // Update the profile's university_connection_status
  const { data, error } = await supabase
    .from("profiles")
    .update({
      university_connection_status: "accepted",
    })
    .eq("id", studentId)
    .select();

  console.log("📊 updated rows:", data);
  console.log("📊 error:", error);

  if (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ NO ROWS UPDATED → ID not found or RLS issue");
    throw new Error("Failed to update student connection status");
  }

  // Also update the department_connections table if it exists
  const { error: connError } = await supabase
    .from("department_connections")
    .update({ 
      status: "accepted",
      updated_at: new Date().toISOString()
    })
    .eq("student_id", studentId);

  if (connError) {
    console.warn("⚠️ Could not update department_connections:", connError);
    // Don't throw - the profile update was successful
  }
}

  // ---------- Reset Connection Request (allow student to retry) ----------
  async resetConnectionRequest(
    studentId: string,
    universityId: string
  ): Promise<void> {
    // Update status to 'pending' so admin can reconsider
    const { error } = await supabase
      .from("department_connections")
      .update({ status: "pending" })
      .eq("student_id", studentId)
      .eq("university_id", universityId);
    if (error) throw new Error(error.message);
  }
}

export const universityStudentsService = new UniversityStudentsService();
