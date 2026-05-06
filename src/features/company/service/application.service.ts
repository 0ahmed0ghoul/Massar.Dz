// features/company/services/application.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  rating: number;
  notes: string | null;
  ai_match_score: number | null;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    university_name: string;
    skills: string[];
  };
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
    const { error } = await supabase
      .from('applications')
      .insert({
        student_id: studentId,
        job_id: jobId,
        cover_letter: coverLetter,
        cv_url: cvUrl,
        status: 'pending',
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
          university_name,
          skills
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
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