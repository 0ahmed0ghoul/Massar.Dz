// Updated student-qa.service.ts
import { ADMIN_QUESTIONS } from "@/constants/admin.constants";
import { authService } from "@/features/auth/service/auth.service";
import { supabase } from "@/lib/supabaseClient";

export interface Question {
  id: string;
  text: string;
  type: "true_false" | "multiple_choice" | "numeric";
  options: string[];
  part: number;
  condition?: {
    dependsOn: string;
    value: string;
  };
}

export interface StudentResponse {
  id: string;
  student_id: string;
  question_id: string; // Now text, not uuid
  answer: string;
  created_at: string;
  updated_at?: string;
}

export const studentQAService = {
  async getUnansweredQuestions(studentId: string): Promise<Question[]> {
    // Get all answered questions for this student
    const { data: answeredResponses, error: answeredError } = await supabase
      .from("student_responses")
      .select("question_id, answer")
      .eq("student_id", studentId);
    
    if (answeredError) throw new Error(answeredError.message);

    const answeredMap = new Map(
      answeredResponses?.map((r) => [r.question_id, r.answer]) || []
    );

    // Filter questions based on conditions
    const unansweredQuestions = ADMIN_QUESTIONS.filter((q) => {
      // Skip if already answered
      if (answeredMap.has(q.id)) return false;

      // If no condition, always show the question
      if (!q.condition) return true;

      // Check conditional questions
      const dependentAnswer = answeredMap.get(q.condition.dependsOn);
      
      // If dependency not answered yet, hide this question
      if (!dependentAnswer) return false;
      
      // Show only if condition is met
      return dependentAnswer === q.condition.value;
    });

    return unansweredQuestions.map((q) => ({
      ...q,
      options: q.options || []
    }));
  },

  async submitAnswer(studentId: string, questionId: string, answer: string): Promise<void> {
    // Use upsert to handle potential duplicate answers (if student tries to answer same question twice)
    const { error } = await supabase
      .from("student_responses")
      .upsert({
        student_id: studentId,
        question_id: questionId,
        answer,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'student_id,question_id', // Requires the unique constraint from migration
      });

    if (error) throw new Error(error.message);

    // Check if all questions are now answered
    const remainingCount = await this.getPendingQuestionsCount(studentId);
    if (remainingCount === 0) {
      // All questions answered, mark as questioned
      await authService.markAsQuestioned(studentId);
    }
  },

  async getPendingQuestionsCount(studentId: string): Promise<number> {
    // Get all answered questions
    const { data: answeredResponses, error: answeredError } = await supabase
      .from("student_responses")
      .select("question_id, answer")
      .eq("student_id", studentId);
    
    if (answeredError) throw new Error(answeredError.message);

    const answeredMap = new Map(
      answeredResponses?.map((r) => [r.question_id, r.answer]) || []
    );

    // Count eligible questions
    const eligibleQuestions = ADMIN_QUESTIONS.filter((q) => {
      if (answeredMap.has(q.id)) return false;

      if (q.condition) {
        const dependentAnswer = answeredMap.get(q.condition.dependsOn);
        if (!dependentAnswer) return true; // Count as pending if dependsOn not answered
        if (dependentAnswer !== q.condition.value) return false;
      }

      return true;
    });

    return eligibleQuestions.length;
  },

// Updated getStudentResponses with debugging
async getStudentResponses(studentIds: string[]): Promise<{
  questionId: string;
  answer: string;
  studentId: string;
}[]> {
  if (!studentIds.length) {
    console.log("⚠️ getStudentResponses: No student IDs provided");
    return [];
  }

  console.log("🔍 getStudentResponses called with IDs:", studentIds);
  console.log("📊 Student IDs count:", studentIds.length);

  // Try the query
  const { data: responses, error } = await supabase
    .from('student_responses')
    .select('student_id, question_id, answer')
    .in('student_id', studentIds);
  
  console.log("📊 Query result:", { 
    dataLength: responses?.length, 
    error: error?.message,
    errorCode: error?.code,
    errorDetails: error?.details,
    errorHint: error?.hint
  });
  
  if (error) {
    console.error('❌ Error fetching responses:', error);
    console.error('❌ Full error:', JSON.stringify(error));
    
    // Check if it's an RLS error
    if (error.code === '42501' || error.message?.includes('permission denied')) {
      console.warn('⚠️ RLS policy may be blocking access to student_responses');
      
      // Try using a raw SQL query or RPC function instead
      const { data: rawData, error: rawError } = await supabase
        .rpc('get_student_responses', { p_student_ids: studentIds });
      
      if (!rawError && rawData) {
        console.log("✅ RPC query succeeded:", rawData.length, "responses");
        return rawData;
      }
    }
    
    throw error;
  }

  console.log("✅ Responses fetched:", responses?.length || 0);
  console.log("📋 All responses:", responses);
  
  return responses || [];
},

  async hasCompletedAllQuestions(studentId: string): Promise<boolean> {
    const pendingCount = await this.getPendingQuestionsCount(studentId);
    return pendingCount === 0;
  }
};