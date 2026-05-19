// features/auth/components/forms/CompanyForm.tsx - FIXED

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, Building2, 
  Building, Sparkles, User, Mail, Lock, Briefcase, 
  Plus, Zap, Crown, FileText, MessageSquare, BarChart3, Brain,
  Rocket, Target, Users, Award, Clock, Shield, Check, Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "../FieldError";
import { PasswordInput } from "../PasswordInput";
import { CompanyFields, companySchema } from "@/schemas/auth.schemas";

type Step = 0 | 1 | 2 | 3;

const labelCls = "text-[11px] font-medium uppercase tracking-wider text-muted-foreground";
const inputCls = "mt-1.5 h-11 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-primary/50 focus:bg-white/10 transition-all";

const COMPANY_TYPES = [
  {
    id: "startup",
    title: "Startup",
    description: "Fast-growing, innovative company",
    icon: Sparkles,
    iconColor: "text-purple-500",
  },
  {
    id: "private",
    title: "Private Company",
    description: "Established business with career paths",
    icon: Building2,
    iconColor: "text-blue-500",
  },
  {
    id: "government",
    title: "Government Entity",
    description: "Public sector organization",
    icon: Building,
    iconColor: "text-emerald-500",
  },
];

const PLANS = [
  {
    id: "basic",
    title: "Basic Plan",
    price: "29,900 DZD",
    priceValue: 29900,
    period: "per year",
    description: "Essential recruitment tools",
    icon: Building2,
    iconColor: "text-slate-400",
    badge: null,
    cta: "Get Basic",
    features: [
      { text: "Post up to 5 jobs/month", included: true },
      { text: "Receive and manage applications", included: true },
      { text: "Basic chat with applicants", included: true },
      { text: "Basic application overview", included: true },
      { text: "AI Skills Matching", included: false },
      { text: "Bulk messaging", included: false },
      { text: "Verified badge", included: false },
    ],
  },
  {
    id: "premium",
    title: "Premium Plan",
    price: "59,900 DZD",
    priceValue: 59900,
    period: "per year",
    description: "AI-powered recruitment suite",
    icon: Crown,
    iconColor: "text-[#639922]",
    badge: "MOST POPULAR",
    cta: "Get Premium",
    features: [
      { text: "Unlimited job postings", included: true, highlight: true },
      { text: "AI Smart Skills Matching", included: true, highlight: true },
      { text: "Bulk messaging to applicants", included: true },
      { text: "Advanced applications analytics", included: true },
      { text: "Priority candidate recommendations", included: true },
      { text: "Verified Company Badge", included: true },
      { text: "Team accounts (up to 5)", included: true },
      { text: "24/7 Priority support", included: true },
    ],
  },
];

const INDUSTRIES = [
  ["technology", "Technology / IT"],
  ["finance", "Finance / Banking"],
  ["healthcare", "Healthcare / Medical"],
  ["education", "Education / Training"],
  ["manufacturing", "Manufacturing"],
  ["retail", "Retail / E-commerce"],
  ["construction", "Construction / Real Estate"],
  ["hospitality", "Hospitality / Tourism"],
  ["logistics", "Logistics / Transportation"],
  ["consulting", "Consulting / Professional Services"],
  ["other", "Other"],
] as const;

interface CompanyFormProps {
  isLoading: boolean;
  onSubmit: (data: any) => void;
  onPlanSelect?: (plan: "basic" | "premium") => void;
  selectedPlan?: "basic" | "premium";
}

export function CompanyForm({ isLoading, onSubmit, onPlanSelect, selectedPlan: externalSelectedPlan }: CompanyFormProps) {
  const [step, setStep] = useState<Step>(0);
  const [companyType, setCompanyType] = useState<string>("");
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<"basic" | "premium" | null>(null);

  const selectedPlan = externalSelectedPlan ?? internalSelectedPlan;  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyFields & { selectedPlan?: string }>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      companyType: "startup",
      industry: "",
      customIndustry: "",
      selectedPlan: "basic",
    },
  });

  const selectedIndustry = watch("industry");
  const isOtherSelected = selectedIndustry === "other";

  const handleCompanyTypeChange = (type: string) => {
    setCompanyType(type);
    setValue("companyType", type);
  };

  const handlePlanChange = (planId: "basic" | "premium") => {
    setInternalSelectedPlan(planId);
    setValue("selectedPlan", planId);
  
    onPlanSelect?.(planId);
  
    console.log("Plan selected:", planId);
  };

  // IMPORTANT: Only submit when on step 3 with a plan selected
  const onSubmitForm = (data: CompanyFields & { selectedPlan?: string }) => {
    // Prevent submission if not on the plan selection step
    if (step !== 3) {
      console.warn("Form submission prevented: not on step 3");
      return;
    }

    // Prevent submission if no plan is selected
    if (!selectedPlan) {
      console.warn("Form submission prevented: no plan selected");
      return;
    }

    let finalIndustry = data.industry;
    if (data.industry === "other" && data.customIndustry?.trim()) {
      finalIndustry = data.customIndustry.trim();
    }

    onSubmit({ 
      ...data, 
      industry: finalIndustry, 
      companyType,
      selectedPlan: selectedPlan,
    });
  };

  const canGoNextFromStep0 = () => !!companyType;
  const canGoNextFromStep1 = () => {
    const fn = watch("firstName");
    const ln = watch("lastName");
    const em = watch("email");
    const pw = watch("password");
    return !!(fn && ln && em && pw) &&
      !errors.firstName && !errors.lastName && !errors.email && !errors.password;
  };
  const canGoNextFromStep2 = () => {
    const companyName = watch("companyName");
    const industry = watch("industry");
    const customIndustry = watch("customIndustry");
    return !!(
      companyName &&
      (industry === "other" ? customIndustry : industry) &&
      !errors.companyName &&
      !errors.industry
    );
  };

  // FIXED: Can only submit from step 3 when a plan is selected
  const canSubmit = () => step === 3 && (selectedPlan === "basic" || selectedPlan === "premium");

  const next = () => step < 3 && setStep((s) => (s + 1) as Step);
  const back = () => step > 0 && setStep((s) => (s - 1) as Step);
  const isLastStep = step === 3;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="w-full">
      {/* Progress bar */}
      <div className="h-0.5 w-full rounded-full bg-white/[0.06] mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-500"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
        />
      </div>

      {/* Step Indicator - compact for sidebar */}
      <div className="flex items-center justify-between mb-8 px-1">
        {[
          { number: 1, title: "Type" },
          { number: 2, title: "Info" },
          { number: 3, title: "Details" },
          { number: 4, title: "Plan" },
        ].map((stepInfo, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
                  transition-all duration-300
                  ${step >= idx 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-white/5 text-white/30 border border-white/10"
                  }
                `}
              >
                {step >= idx ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  stepInfo.number
                )}
              </div>
              <span className="text-[9px] text-white/40 mt-1 hidden sm:block">
                {stepInfo.title}
              </span>
            </div>
            {idx < 3 && (
              <div className={`w-6 h-px mx-1 ${step > idx ? "bg-primary/50" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[380px]"
        >
          {/* STEP 0: Company Type Selection */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-foreground">Select Company Type</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose your organization category
                </p>
              </div>

              <div className="space-y-3">
                {COMPANY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = companyType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleCompanyTypeChange(type.id)}
                      className={`
                        relative w-full text-left rounded-xl p-3 transition-all duration-200
                        ${isSelected 
                          ? "bg-primary/10 border border-primary/30 shadow-lg" 
                          : "border border-white/10 bg-white/5 hover:bg-white/10"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? type.iconColor : "text-white/40"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground">{type.title}</h3>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-foreground">Personal Info</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Your account administrator details
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] text-muted-foreground">First name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                    <Input
                      placeholder="John"
                      {...register("firstName")}
                      className={`${inputCls} pl-9 text-sm`}
                    />
                  </div>
                  <FieldError message={errors.firstName?.message} />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Last name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                    <Input
                      placeholder="Smith"
                      {...register("lastName")}
                      className={`${inputCls} pl-9 text-sm`}
                    />
                  </div>
                  <FieldError message={errors.lastName?.message} />
                </div>
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">Work email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    className={`${inputCls} pl-9 text-sm`}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 z-10" />
                  <PasswordInput
                    id="password"
                    {...register("password")}
                    className={`${inputCls} pl-9 text-sm`}
                  />
                </div>
                <FieldError message={errors.password?.message} />
              </div>
            </div>
          )}

          {/* STEP 2: Company Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-foreground">Company Details</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Tell us about your organization
                </p>
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">Company name</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                  <Input
                    placeholder="Acme Inc."
                    {...register("companyName")}
                    className={`${inputCls} pl-9 text-sm`}
                  />
                </div>
                <FieldError message={errors.companyName?.message} />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">Industry</Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 z-10" />
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`${inputCls} pl-9 text-sm`}>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map(([v, label]) => (
                            <SelectItem key={v} value={v}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FieldError message={errors.industry?.message} />

                {isOtherSelected && (
                  <div className="mt-3">
                    <Input
                      placeholder="Specify your industry"
                      {...register("customIndustry")}
                      className={`${inputCls} text-sm`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Plan Selection - PAYMENT REQUIRED */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-foreground">
                  Choose Your Plan
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a plan to continue (Payment required after registration)
                </p>
              </div>

              {/* Plans */}
              <div className="space-y-3">
                {PLANS.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanChange(plan.id as "basic" | "premium")}
                      className={`
                        relative w-full text-left rounded-xl p-3 transition-all duration-200
                        ${
                          isSelected
                            ? "bg-primary/10 border border-primary/30 shadow-lg shadow-primary/10"
                            : "border border-white/10 bg-white/5 hover:bg-white/10"
                        }
                      `}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <div className="absolute -top-2 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold text-primary-foreground">
                            <Star className="h-2 w-2" />
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        {/* Icon */}
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isSelected ? plan.iconColor : "text-white/40"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between flex-wrap gap-1">
                            <div>
                              <h3 className="text-sm font-bold text-foreground">
                                {plan.title}
                              </h3>

                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {plan.description}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span
                                className={`text-sm font-bold ${
                                  isSelected ? "text-primary" : "text-white/70"
                                }`}
                              >
                                {plan.price}
                              </span>

                              <p className="text-[9px] text-white/35">
                                {plan.period}
                              </p>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                            {plan.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                {feature.included ? (
                                  <Check className="h-2.5 w-2.5 text-primary shrink-0" />
                                ) : (
                                  <div className="h-2.5 w-2.5 shrink-0" />
                                )}

                                <span
                                  className={`text-[9px] ${
                                    feature.included
                                      ? "text-white/60"
                                      : "text-white/30"
                                  } ${
                                    feature.highlight
                                      ? "text-primary font-medium"
                                      : ""
                                  }`}
                                >
                                  {feature.text.length > 25
                                    ? feature.text.slice(0, 22) + "..."
                                    : feature.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Selected */}
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Warning if no plan selected */}
              {!selectedPlan && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                    <p className="text-[9px] text-yellow-500/80 leading-relaxed">
                      Please select a plan to continue
                    </p>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-2 mt-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-primary shrink-0" />
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    After email verification, you'll upload payment receipt in complete profile. Basic accounts also require payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Compact */}
      <div className={`flex flex-col gap-3 mt-6 ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        {isLastStep ? (
          // SUBMIT BUTTON - Only on step 3, only enabled if plan selected
          <button
            type="submit"
            disabled={isLoading || !canSubmit()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating account…</>
            ) : !canSubmit() ? (
              <>Select a plan first</>
            ) : (
              <><Rocket className="h-3.5 w-3.5" /> Create Account</>
            )}
          </button>
        ) : (
          // CONTINUE BUTTON - Steps 0-2
          <button
            type="button"
            onClick={next}
            disabled={
              step === 0 ? !canGoNextFromStep0() :
              step === 1 ? !canGoNextFromStep1() :
              step === 2 ? !canGoNextFromStep2() : false
            }
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}