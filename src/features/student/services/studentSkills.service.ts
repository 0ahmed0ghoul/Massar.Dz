// features/student/services/studentSkills.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface StudentSkill {
  id: string;
  student_id: string;
  skill_id: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  skill?: Skill; // joined data
  created_at: string;
  updated_at: string;
}

class StudentSkillsService {
  // Get all skills from master table (for dropdown)
  async getAllSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Get student's skills with skill details
  async getStudentSkills(studentId: string): Promise<StudentSkill[]> {
    const { data, error } = await supabase
      .from('student_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addSkill(studentId: string, skillId: string, proficiency: string, yearsOfExperience: number): Promise<StudentSkill> {
    const { data, error } = await supabase
      .from('student_skills')
      .insert({
        student_id: studentId,
        skill_id: skillId,
        proficiency,
        years_of_experience: yearsOfExperience,
      })
      .select(`
        *,
        skill:skills(*)
      `)
      .single();
    if (error) {
      if (error.code === '23505') throw new Error('Skill already added');
      throw new Error(error.message);
    }
    return data;
  }

  async updateSkill(skillId: string, updates: { proficiency?: string; years_of_experience?: number }): Promise<StudentSkill> {
    const { data, error } = await supabase
      .from('student_skills')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', skillId)
      .select(`
        *,
        skill:skills(*)
      `)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteSkill(studentSkillId: string): Promise<void> {
    const { error } = await supabase
      .from('student_skills')
      .delete()
      .eq('id', studentSkillId);
    if (error) throw new Error(error.message);
  }
}

export const studentSkillsService = new StudentSkillsService();