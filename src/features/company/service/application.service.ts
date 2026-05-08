// features/company/services/application.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Application } from "@/types/application";

// ============================================================================
// TYPES
// ============================================================================
export interface ApplicationWithDetails {
  id: string;
  job_id: string;
  student_id: string;
  status: string;
  cover_letter?: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
  };
  candidate: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    resume_url: string | null;
    student_card_url: string | null;
    phone: string | null;
    speciality: string | null;
    degree_level: string | null;
    university_name: string | null;
    graduation_year: string | null;
    skills: string[] | null;
  };
}

// Interview data shape (matches the form and hook)
export interface InterviewData {
  interview_date: string; // ISO datetime string
  location: string;
  meeting_link: string;
  notes: string;
}

// ============================================================================
// HELPERS
// ============================================================================
function normalizeSkills(skills: any): string[] {
  if (!skills) return [];
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).toLowerCase().trim());
  }
  if (typeof skills === "string") {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).toLowerCase().trim());
      }
      return skills
        .split(",")
        .map((s) => s.toLowerCase().trim())
        .filter(Boolean);
    } catch {
      return skills
        .split(",")
        .map((s) => s.toLowerCase().trim())
        .filter(Boolean);
    }
  }
  return [];
}

function calculateMatchScore(student: any, job: any): number {
  let totalScore = 0;
  let maxScore = 0;

  const studentSkills = normalizeSkills(student.skills);
  const jobSkills = normalizeSkills(job.skills);

  if (jobSkills.length > 0) {
    const matching = jobSkills.filter((skill) =>
      studentSkills.includes(skill)
    ).length;
    const skillScore = (matching / jobSkills.length) * 60;
    totalScore += skillScore;
  }
  maxScore += 60;

  const experienceMap: Record<string, number> = {
    entry: 0,
    mid: 1,
    senior: 2,
    lead: 3,
  };
  const jobExp = job.experience_level ? experienceMap[job.experience_level] : 0;
  let studentExp = 0;
  if (student.candidate_type === "studying") {
    studentExp = 0;
  } else if (student.candidate_type === "graduated") {
    studentExp = 1;
  } else if (student.years_of_experience) {
    const years = parseFloat(student.years_of_experience);
    if (years < 2) studentExp = 0;
    else if (years < 5) studentExp = 1;
    else if (years < 8) studentExp = 2;
    else studentExp = 3;
  }
  const expDiff = Math.abs(jobExp - studentExp);
  const expScore = Math.max(0, 25 - expDiff * 6);
  totalScore += expScore;
  maxScore += 25;

  if (student.degree_level) {
    const eduMap: Record<string, number> = {
      bachelor: 1,
      master: 2,
      phd: 3,
    };
    const studentEdu = eduMap[student.degree_level] || 0;
    totalScore += studentEdu > 0 ? 15 : 5;
  } else {
    totalScore += 5;
  }
  maxScore += 15;

  if (
    job.job_type === "internship" &&
    student.candidate_type === "studying"
  ) {
    totalScore += 10;
  } else if (
    job.job_type !== "internship" &&
    student.candidate_type !== "studying"
  ) {
    totalScore += 10;
  } else if (
    job.job_type === "internship" &&
    student.candidate_type === "graduated"
  ) {
    totalScore += 3;
  }
  maxScore += 10;

  return Math.round((totalScore / maxScore) * 100);
}

// ============================================================================
// SERVICE
// ============================================================================
class ApplicationService {
  async applyToJob(
    studentId: string,
    jobId: string,
    coverLetter?: string,
    cvFile?: File
  ): Promise<void> {
    let cvUrl: string | undefined;
    if (cvFile) {
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `${studentId}/cv_${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("student-files")
        .upload(filePath, cvFile);
      if (uploadError) throw new Error(uploadError.message);
      const {
        data: { publicUrl },
      } = supabase.storage.from("student-files").getPublicUrl(filePath);
      cvUrl = publicUrl;
    }

    const [jobRes, studentRes] = await Promise.all([
      supabase.from("jobs").select("*").eq("id", jobId).single(),
      supabase.from("profiles").select("*").eq("id", studentId).single(),
    ]);
    if (jobRes.error) throw new Error(jobRes.error.message);
    if (studentRes.error) throw new Error(studentRes.error.message);

    const matchScore = calculateMatchScore(studentRes.data, jobRes.data);

    const { error } = await supabase.from("applications").insert({
      student_id: studentId,
      job_id: jobId,
      cover_letter: coverLetter,
      cv_url: cvUrl,
      status: "pending",
      ai_match_score: matchScore,
    });
    if (error) throw new Error(error.message);
  }

  async getStudentCV(studentId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("resume_url")
      .eq("id", studentId)
      .single();
    if (error) return null;
    return data?.resume_url || null;
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        student:profiles!student_id (
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          university_name,
          skills
        )
      `
      )
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getStudentApplications(studentId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        job:jobs!job_id (
          id,
          title,
          company:profiles!company_id (
            company_name,
            avatar_url
          ),
          job_type,
          location
        )
      `
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getApplicationsForCompany(
    companyId: string,
    limit?: number
  ): Promise<Application[]> {
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id")
      .eq("company_id", companyId);
    if (jobsError) throw new Error(jobsError.message);
    if (!jobs.length) return [];

    const jobIds = jobs.map((j) => j.id);
    let query = supabase
      .from("applications")
      .select(
        `
        *,
        student:profiles!student_id (
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          university_name,
          skills
        ),
        job:jobs!job_id (
          id,
          title
        )
      `
      )
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getTotalApplicationsCountForCompany(companyId: string): Promise<number> {
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id")
      .eq("company_id", companyId);
    if (jobsError) throw new Error(jobsError.message);
    if (!jobs.length) return 0;
    const jobIds = jobs.map((j) => j.id);
    const { count, error } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .in("job_id", jobIds);
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async updateApplicationStatus(
    applicationId: string,
    status: Application["status"]
  ): Promise<Application> {
    const { data, error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateApplicationRating(
    applicationId: string,
    rating: number
  ): Promise<Application> {
    const { data, error } = await supabase
      .from("applications")
      .update({ rating, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateApplicationNotes(
    applicationId: string,
    notes: string
  ): Promise<Application> {
    const { data, error } = await supabase
      .from("applications")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getApplicationByJobAndCandidate(
    jobId: string,
    studentId: string
  ): Promise<ApplicationWithDetails | null> {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        id,
        job_id,
        student_id,
        status,
        cover_letter,
        created_at,
        jobs!job_id (
          id,
          title,
          location,
          job_type,
          description,
          company:profiles!company_id (
            company_name
          )
        ),
        profiles!student_id (
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          resume_url,
          student_card_url,
          speciality,
          degree_level,
          university_name,
          graduation_year,
          skills
        )
      `
      )
      .eq("job_id", jobId)
      .eq("student_id", studentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }
    if (!data) return null;

    const companyName = data.jobs?.company?.company_name || "Unknown Company";

    return {
      id: data.id,
      job_id: data.job_id,
      student_id: data.student_id,
      status: data.status,
      cover_letter: data.cover_letter,
      created_at: data.created_at,
      job: {
        id: data.jobs.id,
        title: data.jobs.title,
        company: companyName,
        location: data.jobs.location,
        type: data.jobs.job_type,
        description: data.jobs.description,
      },
      candidate: data.profiles,
    };
  }
  async getStudentApplicationsWithInterviews(studentId: string): Promise<(Application & { interview?: any })[]> {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        job:jobs!job_id (
          id,
          title,
          company:profiles!company_id (
            company_name,
            avatar_url
          ),
          job_type,
          location
        ),
        interview:interviews(interview_date, location, meeting_link, notes)
      `
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
  
    if (error) throw new Error(error.message);
    return data || [];
  }

  async scheduleInterview(applicationId: string, data: InterviewData): Promise<void> {
    // Verify application exists
    const { error: appCheckError } = await supabase
      .from("applications")
      .select("id")
      .eq("id", applicationId)
      .single();
    if (appCheckError) {
      throw new Error(`Application ${applicationId} not found: ${appCheckError.message}`);
    }
  
    // Convert date to ISO string (Supabase timestamptz expects full ISO)
    let isoDate: string;
    try {
      // data.interview_date is "YYYY-MM-DDThh:mm"
      const dateObj = new Date(data.interview_date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date");
      }
      isoDate = dateObj.toISOString();
    } catch (e) {
      throw new Error(`Invalid interview date format: ${data.interview_date}`);
    }
  
    // Prepare record – use exact column names from your table.
    // If unsure, log the error and adjust.
    const interviewRecord = {
      application_id: applicationId,
      interview_date: isoDate,
      location: data.location || null,
      meeting_link: data.meeting_link || null,
      notes: data.notes || null,
    };
  
    // Delete previous interviews (replace)
    const { error: deleteError } = await supabase
      .from("interviews")
      .delete()
      .eq("application_id", applicationId);
    if (deleteError) {
      console.error("Delete interview error:", deleteError);
      // Continue anyway, might be no existing record
    }
  
    // Insert new interview
    const { error: insertError, data: insertedData } = await supabase
      .from("interviews")
      .insert(interviewRecord)
      .select();
  
    if (insertError) {
      console.error("Full Supabase insert error:", JSON.stringify(insertError, null, 2));
      // Provide actionable message
      if (insertError.code === '42P01') {
        throw new Error("Table 'interviews' does not exist. Please create it.");
      } else if (insertError.code === '23503') {
        throw new Error(`Foreign key violation: Application ID ${applicationId} not found in applications table.`);
      } else if (insertError.code === '42703') {
        throw new Error(`Column error: ${insertError.message}. Check that interview_date, location, meeting_link, notes exist.`);
      } else {
        throw new Error(`Database error: ${insertError.message}`);
      }
    }


    // Update application status if appropriate
    const { data: currentApp } = await supabase
      .from("applications")
      .select("status")
      .eq("id", applicationId)
      .single();
    if (currentApp && (currentApp.status === "pending" || currentApp.status === "interview")) {
      await this.updateApplicationStatus(applicationId, "interview_scheduled");
    }
  }
}

export const applicationService = new ApplicationService();