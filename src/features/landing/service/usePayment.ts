// hooks/usePayment.ts
import { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { paymentService } from "@/features/admin/services/payment.service";
import { PlanType } from "@/types/payment";


export function usePayment() {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const submitPayment = async (
        planType: PlanType,
        amount: number,
        receiptFile: File,
        notes?: string
    ) => {
        if (!user) throw new Error("Not authenticated");
        setSubmitting(true);
        try {
            const request = await paymentService.createPaymentRequest(
                user.id,
                planType,
                amount,
                receiptFile,
                notes
            );
            return request;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitPayment,
        submitting,
    };
}