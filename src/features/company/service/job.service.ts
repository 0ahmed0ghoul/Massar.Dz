// features/company/services/job.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Job, JobInput } from "@/types/job";



class JobService {
  
  async getCompanyJobs(companyId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  // For public job listings: get active jobs with company info
  async getActiveJobs(limit = 20): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:profiles!company_id (
          id,
          company_name,
          avatar_url,
          wilaya
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // For public company profile: get active jobs of a specific company (with company info)
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:profiles!company_id (
          id,
          company_name,
          avatar_url,
          wilaya
        )
      `)
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async createJob(companyId: string, job: JobInput): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert({ ...job, company_id: companyId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateJob(jobId: string, updates: Partial<JobInput>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', jobId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteJob(jobId: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    if (error) throw new Error(error.message);
  }
}

export const jobService = new JobService();