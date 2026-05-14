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
  student_card_url?: string;
  university_connection_status: "none" | "pending" | "connected" | "rejected";
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
  
    // Fetch directly from profiles table
    let { data: students, error } = await supabase
      .from("profiles")
      .select(`
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
        student_card_url,
        candidate_type
      `)
      .eq("role", "student")
      .eq("university_name", universityName);
  
    if (error) {
      console.error("❌ Error fetching students:", error);
      throw new Error(error.message);
    }
  
    console.log("📊 Exact match students count:", students?.length);
  
    // Fallback → case-insensitive search
    if (!students || students.length === 0) {
      console.log("🔍 Trying case-insensitive search...");
  
      const { data: studentsILike, error: likeError } = await supabase
        .from("profiles")
        .select(`
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
          student_card_url,
          role,
          candidate_type
        `)
        .eq("role", "student")
        .ilike("university_name", universityName);
  
      if (likeError) {
        console.error("❌ Error in case-insensitive search:", likeError);
      } else {
        console.log(
          "📊 Case-insensitive match students count:",
          studentsILike?.length
        );
  
        students = studentsILike;
      }
    }
  
    // Optional fallback:
    // fetch students that already have ANY university connection
    if (!students || students.length === 0) {
      console.log("🔍 Fetching students with university connections...");
  
      const { data: connectedStudents, error: connectedError } = await supabase
        .from("profiles")
        .select(`
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
          student_card_url,
          role,
          candidate_type
        `)
        .eq("role", "student")
        .neq("university_connection_status", "none");
  
      if (connectedError) {
        console.error("❌ Error fetching connected students:", connectedError);
      } else {
        students = connectedStudents;
        console.log(
          "📊 Students found via university_connection_status:",
          students?.length
        );
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
      student_card_url: student.student_card_url || '',
      university_connection_status:
        (student.university_connection_status as PlatformStudent["university_connection_status"]) ||
        "none",
      rejection_reason: undefined,
      university_name: student.university_name || undefined,
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

// ---------- Reject Student ----------
async rejectStudent(rejection: RejectionData): Promise<void> {
  // Update student's profile status only
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      university_connection_status: "rejected",
    })
    .eq("id", rejection.studentId);

  if (profileError) {
    throw new Error(profileError.message);
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

          <p>
            Your connection request to the university department
            has been reviewed and was not approved at this time.
          </p>

          <p>
            <strong>Reason for rejection:</strong>
            ${rejection.reason}
          </p>

          <p>
            You can update your profile information and
            submit a new connection request from your dashboard.
          </p>

          <p>
            Best regards,<br/>
            University Administration
          </p>
        </div>
      `,
      },
    }
  );

  if (emailError) {
    console.error("Failed to send rejection email:", emailError);
  }
}

// ---------- Approve Student Connection ----------
async approveStudentConnection(
  studentId: string,
  universityName: string
): Promise<void> {
  console.log("🚀 approveStudentConnection called with:", {
    studentId,
    universityName,
  });

  // Update student profile only
  const { data, error } = await supabase
    .from("profiles")
    .update({
      university_connection_status: "connected",
      university_name: universityName,
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

    throw new Error(
      "Failed to update student connection status"
    );
  }
}

// ---------- Reset Connection Request ----------
async resetConnectionRequest(
  studentId: string
): Promise<void> {
  // Allow student to retry connection
  const { error } = await supabase
    .from("profiles")
    .update({
      university_connection_status: "pending",
    })
    .eq("id", studentId);

  if (error) {
    throw new Error(error.message);
  }
}

}

export const universityStudentsService = new UniversityStudentsService();
