import { supabase } from "@/lib/supabaseClient";

export const subscriptionService = {
  async getPlans() {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });
    if (error) throw error;
    return data;
  },

  async createPaymentRequest(userId: string, planName: string, amount: number) {
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        user_id: userId,
        plan_name: planName,
        amount,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getPaymentRequest(paymentId: string) {
    const { data, error } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("id", paymentId)
      .single();
    if (error) throw error;
    return data;
  },

  async uploadReceipt(paymentId: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${paymentId}/receipt.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-receipts")
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage
      .from("payment-receipts")
      .getPublicUrl(fileName);
    return publicUrl;
  },

  async updatePaymentRequest(paymentId: string, updates: any) {
    const { error } = await supabase
      .from("payment_requests")
      .update(updates)
      .eq("id", paymentId);
    if (error) throw error;
  },

  async approvePayment(paymentId: string, userId: string) {
    // 1. Update payment request status to 'verified'
    await this.updatePaymentRequest(paymentId, { status: "verified" });
    // 2. Update user's profile to set is_premium = true
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", userId);
    if (error) throw error;
  },
};