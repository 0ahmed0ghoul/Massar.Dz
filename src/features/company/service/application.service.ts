// features/company/services/application.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Application } from "@/types/application";

// Helper to calculate match score (0-100)
function calculateMatchScore(student: any, job: any): number {
  let totalScore = 0;
  let maxScore = 0;

  // 1. Skills match (max 60 points)
  if (job.skills?.length && student.skills?.length) {
    const studentSkills = student.skills.map((s: string) => s.toLowerCase());
    const jobSkills = job.skills.map((s: string) => s.toLowerCase());
    const matching = jobSkills.filter(skill => studentSkills.includes(skill)).length;
    const skillScore = (matching / jobSkills.length) * 60;
    totalScore += skillScore;
  }
  maxScore += 60;

  // 2. Experience level match (max 25 points)
  const experienceMap: Record<string, number> = { entry: 0, mid: 1, senior: 2, lead: 3 };
  const jobExp = job.experience_level ? experienceMap[job.experience_level] : 0;
  let studentExp = 0;
  if (student.candidate_type === 'studying') studentExp = 0;
  else if (student.candidate_type === 'graduated') studentExp = 1;
  else if (student.years_of_experience) {
    const years = parseFloat(student.years_of_experience);
    if (years < 2) studentExp = 0;
    else if (years < 5) studentExp = 1;
    else if (years < 8) studentExp = 2;
    else studentExp = 3;
  }
  const expDiff = Math.abs(jobExp - studentExp);
  const expScore = Math.max(0, 25 - expDiff * 6); // 0-25
  totalScore += expScore;
  maxScore += 25;

  // 3. Education level (max 15 points) – using student's degree only (since job may not have requirement)
  if (student.degree_level) {
    const eduMap: Record<string, number> = { bachelor: 1, master: 2, phd: 3 };
    const studentEdu = eduMap[student.degree_level] || 0;
    // Assume any degree adds 15, else less
    totalScore += studentEdu > 0 ? 15 : 5;
  } else {
    totalScore += 5;
  }
  maxScore += 15;

  // 4. Job type suitability (max 10 points)
  if (job.job_type === 'internship' && student.candidate_type === 'studying') {
    totalScore += 10;
  } else if (job.job_type !== 'internship' && student.candidate_type !== 'studying') {
    totalScore += 10;
  } else if (job.job_type === 'internship' && student.candidate_type === 'graduated') {
    totalScore += 3;
  }
  maxScore += 10;

  return Math.round((totalScore / maxScore) * 100);
}

class ApplicationService {
  
  async applyToJob(studentId: string, jobId: string, coverLetter?: string, cvFile?: File): Promise<void> {
    let cvUrl: string | undefined;
    if (cvFile) {
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${studentId}/cv_${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('student-files')
        .upload(filePath, cvFile);
      if (uploadError) throw new Error(uploadError.message);
      const { data: { publicUrl } } = supabase.storage
        .from('student-files')
        .getPublicUrl(filePath);
      cvUrl = publicUrl;
    }
  
    // Fetch job and student profile to compute match score
    const [jobRes, studentRes] = await Promise.all([
      supabase.from('jobs').select('*').eq('id', jobId).single(),
      supabase.from('profiles').select('*').eq('id', studentId).single(),
    ]);
    if (jobRes.error) throw new Error(jobRes.error.message);
    if (studentRes.error) throw new Error(studentRes.error.message);
    const matchScore = calculateMatchScore(studentRes.data, jobRes.data);
  
    const { error } = await supabase
      .from('applications')
      .insert({
        student_id: studentId,
        job_id: jobId,
        cover_letter: coverLetter,
        cv_url: cvUrl,
        status: 'pending',
        ai_match_score: matchScore,
      });
    if (error) throw new Error(error.message);
  }

  async getStudentCV(studentId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('resume_url')
      .eq('id', studentId)
      .single();
    if (error) return null;
    return data?.resume_url || null;
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
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
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }
// Add to application.service.ts
async getStudentApplications(studentId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select(`
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
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
  async getApplicationsForCompany(companyId: string, limit?: number): Promise<Application[]> {
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', companyId);
    if (jobsError) throw new Error(jobsError.message);
    if (!jobs.length) return [];

    const jobIds = jobs.map(j => j.id);
    let query = supabase
      .from('applications')
      .select(`
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
      `)
      .in('job_id', jobIds)
      .order('created_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getTotalApplicationsCountForCompany(companyId: string): Promise<number> {
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', companyId);
    if (jobsError) throw new Error(jobsError.message);
    if (!jobs.length) return 0;
    const jobIds = jobs.map(j => j.id);
    const { count, error } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .in('job_id', jobIds);
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async updateApplicationStatus(applicationId: string, status: Application['status']): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateApplicationRating(applicationId: string, rating: number): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update({ rating, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateApplicationNotes(applicationId: string, notes: string): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export const applicationService = new ApplicationService();