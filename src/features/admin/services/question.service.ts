// features/admin/services/question.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Question {
  id: string;
  text: string;
  type: 'true_false' | 'multiple_choice';
  options: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const questionService = {
  // In getQuestions: optionally allow filtering by status
async getQuestions(status?: 'draft' | 'published'): Promise<Question[]> {
  let query = supabase.from('admin_questions').select('*');
  if (status) query = query.eq('status', status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
},

// In createQuestion: new questions are 'draft'
async createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Question> {
  const { data, error } = await supabase
    .from('admin_questions')
    .insert({ ...question, status: 'draft' }) // default draft
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
},

// Publish a question (no edit allowed after publish)
async publishQuestion(id: string): Promise<Question> {
  const { data, error } = await supabase
    .from('admin_questions')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
},



  async updateQuestion(id: string, updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>): Promise<Question> {
    const { data, error } = await supabase
      .from('admin_questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_questions')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  // For statistics (count responses per question)
  async getResponseStats(questionId: string): Promise<{ answer: string; count: number }[]> {
    const { data, error } = await supabase
      .from('student_responses')
      .select('answer, count:answer')
      .eq('question_id', questionId)
      .select('answer', { count: 'exact', head: false })
      .then(async ({ data, error }) => {
        if (error) throw error;
        // manual aggregate because Supabase doesn't support group by in this simple call
        const stats: Record<string, number> = {};
        (data || []).forEach(row => {
          stats[row.answer] = (stats[row.answer] || 0) + 1;
        });
        return Object.entries(stats).map(([answer, count]) => ({ answer, count }));
      });
      return data || [];
  },

  async getTotalGraduatedStudentsCount(): Promise<number> {
    // Count students who are either 'graduated' or have a graduation year (fallback)
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .or('candidate_type.eq.graduated');
    if (error) throw new Error(error.message);
    return count || 0;
  },
  
  async getTotalRespondentsCount(): Promise<number> {
    // Count distinct students who answered any question
    const { data, error } = await supabase
      .from('student_responses')
      .select('student_id');
    if (error) throw new Error(error.message);
    const uniqueStudents = new Set((data || []).map(r => r.student_id));
    return uniqueStudents.size;
  },

async getQuestionStats(questionId: string): Promise<{ answer: string; count: number }[]> {
  const { data, error } = await supabase
    .from('student_responses')
    .select('answer')
    .eq('question_id', questionId);
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  (data || []).forEach(row => {
    counts[row.answer] = (counts[row.answer] || 0) + 1;
  });
  return Object.entries(counts).map(([answer, count]) => ({ answer, count }));
}
};