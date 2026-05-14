// constants/pricing.constants.ts
import { Plan } from "@/types/payment";

export const CCP_ACCOUNT = {
  name: 'Massar Platform',
  accountNumber: '123456 78',
  rib: '12345678901234567890',
  bank: 'Algerian Post (CCP)',
};

export const STUDENT_PLANS: Plan[] = [
  {
    id: 'student_yearly',
    name: 'Student Yearly',
    price: 9999,
    period: 'year',
    for: 'student',
    features: [
      'Unlimited job applies',
      'AI Resume auto‑extract skills & experience',
      'Smart Ranking – AI match scoring',
      'Priority support',
    ],  },
];

export const COMPANY_PLANS: Plan[] = [
  {
    id: 'company_yearly',
    name: 'Company Growth',
    price: 49999,
    period: 'year',
    for: 'company',
    features: [
      'Unlimited job postings',
      'AI Resume Parser – auto‑extract skills & experience',
      'Smart Ranking – AI match scoring',
      'Bulk Messaging to candidates',
      'Advanced analytics & funnel metrics',
      'Priority support',
    ],
    recommended: true,
  },
];

export const getStudentPromotion = (hasStars: boolean, hasMajor: boolean) => {
  if (hasStars && hasMajor) {
    return {
      eligible: true,
      discount: 100,
      message: "🎉 You've earned both Stars and Major certificates – get Premium FREE for one year!",
      freePlanId: 'student_premium',
    };
  }
  if (hasStars || hasMajor) {
    return {
      eligible: true,
      discount: 50,
      message: "🌟 You have one university certificate! Enjoy 50% off any yearly plan.",
      freePlanId: null,
    };
  }
  return { eligible: false, discount: 0, message: null, freePlanId: null };
};