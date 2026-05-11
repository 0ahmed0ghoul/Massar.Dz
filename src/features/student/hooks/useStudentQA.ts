import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { studentQAService, Question } from "../services/student-qa.service";

export function useStudentQA() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();

  const loadUnanswered = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await studentQAService.getUnansweredQuestions(user.id);
      setQuestions(data);
      const count = await studentQAService.getPendingQuestionsCount(user.id);
      setPendingCount(count);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadUnanswered();
  }, [loadUnanswered]);

  const submitAnswer = async (questionId: string, answer: string) => {
    if (!user) return false;
    setSubmitting(true);
    try {
      await studentQAService.submitAnswer(user.id, questionId, answer);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setPendingCount((c) => c - 1);
      toast({ title: "Answer submitted", description: "Thank you for your response!" });
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    questions,
    loading,
    submitting,
    pendingCount,
    refresh: loadUnanswered,
    submitAnswer,
  };
}