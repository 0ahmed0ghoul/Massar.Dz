// features/admin/services/payment.service.ts

import { supabase } from "@/lib/supabaseClient";

export interface PaymentRequest {
  id: string;
  user_id: string;
  plan_type: "basic" | "premium";
  amount: number;
  receipt_url: string | null;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequestWithProfile extends PaymentRequest {
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    company_name?: string;
  };
}

export const paymentService = {
  async createPaymentRequest(
    userId: string,
    planType: "basic" | "premium",
    amount: number,
    receiptFile: File,
    notes?: string
  ): Promise<PaymentRequest> {
    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `payment-receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-files')
      .upload(filePath, receiptFile);
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from('payment-files')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        user_id: userId,
        plan_type: planType,
        amount,
        receipt_url: publicUrl,
        notes,
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPendingPaymentRequests(): Promise<PaymentRequestWithProfile[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        profiles!user_id (
          first_name,
          last_name,
          email,
          company_name,
          role
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async approvePayment(requestId: string, adminId: string): Promise<void> {
    const { data: request, error: fetchError } = await supabase
      .from('payment_requests')
      .select('user_id, plan_type')
      .eq('id', requestId)
      .single();
    if (fetchError || !request) throw new Error('Request not found');

    // Update payment request status
    const { error: updateError } = await supabase
      .from('payment_requests')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);
    if (updateError) throw new Error(updateError.message);

    // Update user's profile with plan_type and plan_status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        plan_type: request.plan_type,
        plan_status: 'active'
      })
      .eq('id', request.user_id);
    if (profileError) throw new Error(profileError.message);
  },

  async rejectPayment(requestId: string, adminId: string): Promise<void> {
    const { data: request, error: fetchError } = await supabase
      .from('payment_requests')
      .select('user_id')
      .eq('id', requestId)
      .single();
    if (fetchError || !request) throw new Error('Request not found');

    const { error } = await supabase
      .from('payment_requests')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
        approved_by: adminId,
      })
      .eq('id', requestId);
    if (error) throw new Error(error.message);

    // Update user's profile plan_status to rejected
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ plan_status: 'rejected' })
      .eq('id', request.user_id);
    if (profileError) throw new Error(profileError.message);
  },

  async getPaymentRequest(paymentId: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', paymentId)
      .single();
    if (error) return null;
    return data;
  },

  async updatePaymentRequest(
    paymentId: string,
    updates: Partial<PaymentRequest>
  ): Promise<void> {
    const { error } = await supabase
      .from('payment_requests')
      .update(updates)
      .eq('id', paymentId);
    if (error) throw new Error(error.message);
  },

  async uploadReceipt(paymentId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${paymentId}/${Date.now()}.${fileExt}`;
    const filePath = `payment-receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-files')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from('payment-files')
      .getPublicUrl(filePath);

    await this.updatePaymentRequest(paymentId, { receipt_url: publicUrl });

    return publicUrl;
  },
};