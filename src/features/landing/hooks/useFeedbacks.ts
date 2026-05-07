// features/feedback/hooks/useFeedbacks.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Feedback,
  FeedbackInput,
  feedbackService,
} from "../service/feedback.service";
import { supabase } from "@/lib/supabaseClient";

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // ───────────── LOAD FEEDBACKS ─────────────
  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getVisibleFeedbacks();
      setFeedbacks(data);
    } catch (error: any) {
      console.error("Failed to load feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // ───────────── SUBMIT FEEDBACK ─────────────
  const submitFeedback = async (input: FeedbackInput) => {
    setSubmitting(true);

    try {
      // force session sync (fixes many RLS ghost issues)
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error("No active session. Please login again.");
      }

      const result = await feedbackService.submitFeedback(input);

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted for review.",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    feedbacks,
    loading,
    submitting,
    submitFeedback,
    refresh: loadFeedbacks,
  };
}