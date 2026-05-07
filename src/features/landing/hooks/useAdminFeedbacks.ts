// features/feedback/hooks/useAdminFeedbacks.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Feedback, feedbackService } from '../service/feedback.service';

export function useAdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getAllFeedbacks();
      setFeedbacks(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const updateStatus = async (id: string, status: Feedback['status'], is_visible: boolean) => {
    setActionLoading(id);
    try {
      const updated = await feedbackService.updateFeedbackStatus(id, status, is_visible);
      setFeedbacks(prev => prev.map(f => f.id === id ? updated : f));
      toast({ title: 'Success', description: 'Feedback updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    setActionLoading(id);
    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      toast({ title: 'Deleted', description: 'Feedback removed.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    feedbacks,
    loading,
    actionLoading,
    updateStatus,
    deleteFeedback,
    refresh: loadFeedbacks,
  };
}