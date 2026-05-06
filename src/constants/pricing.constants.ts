
export const CCP_ACCOUNT = {
    name: 'Massar Platform',
    accountNumber: '123456 78',
    rib: '12345678901234567890',
    bank: 'Algerian Post (CCP)',
};
// constants/pricing.constants.ts
import { Plan } from "@/features/admin/types/payment.types";

export const STUDENT_PLANS: Plan[] = [
    { id: 'student_monthly', name: 'Student Monthly', price: 999, period: 'month', for: 'student', features: ['AI job recommendations', 'Priority support', 'Profile boost'] },
    { id: 'student_yearly', name: 'Student Yearly', price: 9999, period: 'year', for: 'student', features: ['Save 16%', 'All monthly features', 'Extended support'] },
    { id: 'student_premium', name: 'Student Premium', price: 14999, period: 'year', for: 'student', features: ['1-on-1 career coaching', 'CV review', 'Priority application review'], recommended: true }
];

export const COMPANY_PLANS: Plan[] = [
    { id: 'company_monthly', name: 'Company Starter', price: 4999, period: 'month', for: 'company', features: ['Post 10 jobs', 'Basic analytics', 'Candidate search'] },
    { id: 'company_yearly', name: 'Company Growth', price: 49999, period: 'year', for: 'company', features: ['Unlimited jobs', 'Advanced analytics', 'AI matching', 'Priority support'], recommended: true },
    { id: 'company_enterprise', name: 'Enterprise', price: 149999, period: 'year', for: 'company', features: ['Dedicated manager', 'Custom integrations', 'Branded page', 'ATS integration'] }
];

export const getStudentPromotion = (hasStars: boolean, hasMajor: boolean) => {
    if (hasStars && hasMajor) {
        return {
            eligible: true,
            discount: 100,
            message: "🎉 You've earned both Stars and Major certificates – get Premium FREE for one year!",
            freePlanId: 'student_premium'
        };
    }
    if (hasStars || hasMajor) {
        return {
            eligible: true,
            discount: 50,
            message: "🌟 You have one university certificate! Enjoy 50% off any yearly plan.",
            freePlanId: null
        };
    }
    return { eligible: false, discount: 0, message: null, freePlanId: null };
};