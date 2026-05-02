export type PlanType = 'student_monthly' | 'student_yearly' | 'company_monthly' | 'company_yearly';

export interface PaymentRequest {
    id: string;
    user_id: string;
    plan_type: PlanType;
    amount: number;
    receipt_url?: string;
    notes?: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: string;
    approved_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentRequestWithProfile extends PaymentRequest {
    profiles: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface Plan {
    recommended: any;
    id: PlanType;
    name: string;
    price: number;
    period: string;
    features: string[];
    for: 'student' | 'company';
}