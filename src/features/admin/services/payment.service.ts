// services/payment.service.ts
import { supabase } from "@/lib/supabaseClient";
import { PaymentRequestWithProfile, PlanType } from "@/types/payment";

export const paymentService = {
    async createPaymentRequest(
        userId: string,
        planType: PlanType,
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

    // ✅ Fixed join query to fetch profile data
    async getPendingPaymentRequests(): Promise<PaymentRequestWithProfile[]> {
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, profiles!user_id (first_name, last_name, email)')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });
        if (error) throw new Error(error.message);
        return data || [];
    },

    async approvePayment(requestId: string, adminId: string): Promise<void> {
        const { data: request, error: fetchError } = await supabase
            .from('payment_requests')
            .select('user_id')
            .eq('id', requestId)
            .single();
        if (fetchError || !request) throw new Error('Request not found');

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

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', request.user_id);
        if (profileError) throw new Error(profileError.message);
    },

    async rejectPayment(requestId: string, adminId: string): Promise<void> {
        const { error } = await supabase
            .from('payment_requests')
            .update({
                status: 'rejected',
                updated_at: new Date().toISOString(),
                approved_by: adminId,
            })
            .eq('id', requestId);
        if (error) throw new Error(error.message);
    },
};