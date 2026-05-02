// hooks/usePayment.ts
import { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { PlanType } from "@/features/admin/types/payment.types";
import { paymentService } from "@/features/admin/services/payment.service";


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