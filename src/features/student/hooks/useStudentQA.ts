// Updated useStudentQA.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { studentQAService, Question } from "../services/student-qa.service";
import { authService } from "@/features/auth/service/auth.service";

export function useStudentQA() {
  const { user, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const loadUnanswered = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await studentQAService.getUnansweredQuestions(user.id);
      setQuestions(data);
      const count = await studentQAService.getPendingQuestionsCount(user.id);
      setPendingCount(count);
      setCompleted(count === 0);
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
      
      // Reload questions to get updated list (conditionals may appear/disappear)
      await loadUnanswered();
      
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is already questioned on mount
  const checkQuestionedStatus = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await authService.fetchProfile(user.id);
      if (profile?.is_questioned) {
        setCompleted(true);
        setPendingCount(0);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error checking questioned status:", error);
    }
  }, [user]);

  useEffect(() => {
    checkQuestionedStatus();
  }, [checkQuestionedStatus]);

  return {
    questions,
    loading,
    submitting,
    pendingCount,
    completed,
    refresh: loadUnanswered,
    submitAnswer,
  };
}