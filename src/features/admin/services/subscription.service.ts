import { supabase } from "@/lib/supabaseClient";

export const subscriptionService = {


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

  async approvePayment(
    paymentId: string,
    userId: string,
    planType: "basic" | "premium"
  ) {
    // Update payment request status
    await this.updatePaymentRequest(paymentId, {
      status: "verified",
    });
  
    // Update user subscription
    const { error } = await supabase
      .from("profiles")
      .update({
        plan_type: planType,
        // Companies become active after approval
        status: "active",
        is_verified: true,
      })
      .eq("id", userId);
  
    if (error) throw error;
  },
};