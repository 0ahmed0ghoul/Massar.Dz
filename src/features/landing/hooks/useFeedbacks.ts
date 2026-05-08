// features/feedback/hooks/useFeedbacks.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Feedback, FeedbackInput, feedbackService } from "../service/feedback.service";

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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

  const submitFeedback = async (input: FeedbackInput) => {
    setSubmitting(true);
    try {
      await feedbackService.submitFeedback(input);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted for review.",
      });
      // Reload the visible feedbacks after successful submission
      await loadFeedbacks();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
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