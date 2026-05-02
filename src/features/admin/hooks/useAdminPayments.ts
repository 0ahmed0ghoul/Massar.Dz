// hooks/useAdminPayments.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { PaymentRequestWithProfile } from "../types/payment.types";
import { paymentService } from "../services/payment.service";


export function useAdminPayments() {
    const { user } = useAuth();
    const [pendingRequests, setPendingRequests] = useState<PaymentRequestWithProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadPending = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await paymentService.getPendingPaymentRequests();
            setPendingRequests(data);
        } catch (err) {
            console.error("Failed to load pending payments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, [user]);

    const approve = async (requestId: string) => {
        if (!user) return;
        setActionLoading(requestId);
        try {
            await paymentService.approvePayment(requestId, user.id);
            await loadPending();
        } catch (err) {
            console.error("Approval failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const reject = async (requestId: string) => {
        if (!user) return;
        setActionLoading(requestId);
        try {
            await paymentService.rejectPayment(requestId, user.id);
            await loadPending();
        } catch (err) {
            console.error("Rejection failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    return {
        pendingRequests,
        loading,
        actionLoading,
        approve,
        reject,
        refresh: loadPending,
    };
}