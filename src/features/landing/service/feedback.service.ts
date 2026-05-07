// features/feedback/services/feedback.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Feedback {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedbackInput {
  name: string;
  email?: string;
  rating: number;
  message: string;
}

class FeedbackService {
  // Submit a new feedback (public)
  async submitFeedback(feedback: FeedbackInput): Promise<Feedback> {
    const {
        data: { session },
      } = await supabase.auth.getSession();
      
      console.log("SESSION:", session);
      console.log("USER:", session?.user);
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        name: feedback.name,
        email: feedback.email || null,
        rating: feedback.rating,
        message: feedback.message,
        status: 'pending',
        is_visible: false,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  // Get visible, approved feedbacks for landing page
  async getVisibleFeedbacks(limit = 10): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('status', 'approved')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Admin: get all feedbacks (for management)
  async getAllFeedbacks(): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Admin: update feedback status & visibility
  async updateFeedbackStatus(id: string, status: Feedback['status'], is_visible: boolean): Promise<Feedback> {
    const { data, error } = await supabase
      .from('feedbacks')
      .update({ status, is_visible, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  // Admin: delete feedback
  async deleteFeedback(id: string): Promise<void> {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const feedbackService = new FeedbackService();