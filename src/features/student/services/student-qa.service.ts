import { supabase } from "@/lib/supabaseClient";

export interface Question {
  id: string;
  text: string;
  type: "true_false" | "multiple_choice";
  options: string[];
}

export const studentQAService = {
  async getUnansweredQuestions(studentId: string): Promise<Question[]> {
    const { data: answeredIds, error: answeredError } = await supabase
      .from("student_responses")
      .select("question_id")
      .eq("student_id", studentId);
    if (answeredError) throw new Error(answeredError.message);
  
    const answeredQuestionIds = answeredIds.map((r) => r.question_id);
    let query = supabase
      .from("admin_questions")
      .select("*")
      .eq("status", "published")  // ONLY published
      .order("created_at", { ascending: true });
    if (answeredQuestionIds.length > 0) {
      query = query.not("id", "in", `(${answeredQuestionIds.join(",")})`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async submitAnswer(studentId: string, questionId: string, answer: string): Promise<void> {
    const { error } = await supabase.from("student_responses").insert({
      student_id: studentId,
      question_id: questionId,
      answer,
    });
    if (error) throw new Error(error.message);
  },

  async getPendingQuestionsCount(studentId: string): Promise<number> {
    const { count, error } = await supabase
      .from("admin_questions")
      .select("id", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    if (count === 0) return 0;

    const { count: answeredCount, error: answeredError } = await supabase
      .from("student_responses")
      .select("question_id", { count: "exact", head: true })
      .eq("student_id", studentId);
    if (answeredError) throw new Error(answeredError.message);
    return (count || 0) - (answeredCount || 0);
  },
};