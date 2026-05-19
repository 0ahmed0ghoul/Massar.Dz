// features/student/services/experience.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Experience, ExperienceInput } from "@/types/experience";



class ExperienceService {
  async getAllExperiences(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data || [];
  }
  async getExperiences(studentId: string): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('student_id', studentId)
      .order('start_date', { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addExperience(studentId: string, exp: ExperienceInput): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .insert({ ...exp, student_id: studentId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateExperience(expId: string, updates: Partial<Omit<ExperienceInput, 'student_id'>>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', expId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteExperience(expId: string): Promise<void> {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', expId);
    if (error) throw new Error(error.message);
  }
}

export const experienceService = new ExperienceService();