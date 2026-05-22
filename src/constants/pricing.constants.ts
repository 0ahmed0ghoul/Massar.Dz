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
    id: "student_premium",
    name: "Student Premium",
    price: 2000,
    period: "month",
    for: "student",
    features: [
      "Unlimited job applies",
      "AI Resume parsing",
      "Smart ranking",
      "Priority support",
    ],
  },
];

export const COMPANY_PLANS: Plan[] = [
  {
    id: "company_basic",
    name: "Company Basic",
    price: 3000,
    period: "month",
    for: "company",
    features: [
      "Job postings (limited)",
      "Candidate browsing",
    ],
  },
  {
    id: "company_premium",
    name: "Company Premium",
    price: 5000,
    period: "month",
    for: "company",
    recommended: true,
    features: [
      "Unlimited job postings",
      "Smart ranking",
      "Analytics",
      "Bulk messaging",
    ],
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