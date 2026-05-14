// features/auth/components/CompanyForm.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Building2, TrendingUp, Building, Sparkles, User, Mail, Lock, Briefcase, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companySchema, CompanyFields } from "../../schemas/auth.schemas";

type Step = 0 | 1 | 2;

const labelCls = "text-[11px] font-medium uppercase tracking-wider text-white/45";
const inputCls = "mt-1.5 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/80 placeholder:text-white/20 focus:border-[#639922]/35 focus:bg-[#639922]/[0.03] focus:ring-2 focus:ring-[#639922]/10 transition-all";

const COMPANY_TYPES = [
  {
    id: "startup",
    title: "Startup",
    description: "Fast-growing, innovative company seeking fresh talent",
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-500",
  },
  {
    id: "private",
    title: "Private Company",
    description: "Established business with structured career paths",
    icon: Building2,
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
  {
    id: "government",
    title: "Government Entity",
    description: "Public sector organization with stability",
    icon: Building,
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-500",
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

export function CompanyForm({ isLoading, onSubmit }: { isLoading: boolean; onSubmit: (data: any) => void }) {
  const [step, setStep] = useState<Step>(0);
  const [companyType, setCompanyType] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyFields>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      companyType: "",
      industry: "",
      customIndustry: "",
    },
  });

  const selectedIndustry = watch("industry");
  const isOtherSelected = selectedIndustry === "other";

  const handleCompanyTypeChange = (type: string) => {
    setCompanyType(type);
    setValue("companyType", type);
  };

  const onSubmitForm = (data: CompanyFields) => {
    let finalIndustry = data.industry;
    if (data.industry === "other" && data.customIndustry?.trim()) {
      finalIndustry = data.customIndustry.trim();
    }
    onSubmit({ ...data, industry: finalIndustry, companyType });
  };

  // Step validation
  const canGoNextFromStep0 = () => !!companyType;
  const canGoNextFromStep1 = () => {
    const fn = watch("firstName");
    const ln = watch("lastName");
    const em = watch("email");
    const pw = watch("password");
    return !!(fn && ln && em && pw) &&
      !errors.firstName && !errors.lastName && !errors.email && !errors.password;
  };
  const canSubmitStep2 = () => {
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

  const next = () => step < 2 && setStep((s) => (s + 1) as Step);
  const back = () => step > 0 && setStep((s) => (s - 1) as Step);
  const isLastStep = step === 2;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="h-0.5 w-full rounded-full bg-white/[0.06] mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#639922]/60 to-[#639922] transition-all duration-500"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { number: 1, title: "Company Type" },
          { number: 2, title: "Personal Info" },
          { number: 3, title: "Company Details" },
        ].map((stepInfo, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                  transition-all duration-300
                  ${step >= idx 
                    ? "bg-[#639922] text-black shadow-lg shadow-[#639922]/30" 
                    : "bg-white/[0.06] text-white/30 border border-white/[0.08]"
                  }
                `}
              >
                {stepInfo.number}
              </div>
              <span className="text-[10px] text-white/40 mt-1.5 hidden sm:block">
                {stepInfo.title}
              </span>
            </div>
            {idx < 2 && (
              <div className={`w-12 h-px mx-2 ${step > idx ? "bg-[#639922]/50" : "bg-white/[0.06]"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="min-h-[360px]"
        >
          {/* STEP 0: Company Type Selection */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white/85">Select Company Type</h2>
                <p className="text-sm text-white/35 mt-1">
                  Choose the category that best describes your organization
                </p>
              </div>

              <div className="grid gap-4">
                {COMPANY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = companyType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleCompanyTypeChange(type.id)}
                      className={`
                        group relative w-full text-left rounded-xl p-4 transition-all duration-200
                        ${isSelected 
                          ? `bg-gradient-to-r ${type.color} border ${type.border} shadow-lg` 
                          : "border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]"
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`
                          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                          transition-all duration-200
                          ${isSelected ? type.iconColor : "text-white/30 group-hover:text-white/50"}
                        `}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white/85">
                            {type.title}
                          </h3>
                          <p className="text-sm text-white/40 mt-0.5">
                            {type.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#639922]">
                            <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
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
            <div className="space-y-5">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white/85">Personal Information</h2>
                <p className="text-sm text-white/35 mt-1">
                  Your account administrator details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label className={labelCls}>First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                    <Input
                      placeholder="John"
                      {...register("firstName")}
                      className={`${inputCls} pl-10 ${errors.firstName ? "border-red-500/50" : ""}`}
                    />
                  </div>
                  <FieldError message={errors.firstName?.message} />
                </div>

                <div>
                  <Label className={labelCls}>Last name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                    <Input
                      placeholder="Smith"
                      {...register("lastName")}
                      className={`${inputCls} pl-10 ${errors.lastName ? "border-red-500/50" : ""}`}
                    />
                  </div>
                  <FieldError message={errors.lastName?.message} />
                </div>
              </div>

              <div>
                <Label className={labelCls}>Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    className={`${inputCls} pl-10 ${errors.email ? "border-red-500/50" : ""}`}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label className={labelCls}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 z-10" />
                  <PasswordInput
                    id="password"
                    {...register("password")}
                    className={`${inputCls} pl-10 ${errors.password ? "border-red-500/50" : ""}`}
                  />
                </div>
                <FieldError message={errors.password?.message} />
              </div>
            </div>
          )}

          {/* STEP 2: Company Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white/85">Company Details</h2>
                <p className="text-sm text-white/35 mt-1">
                  Tell us about your organization
                </p>
              </div>

              <div>
                <Label className={labelCls}>Company name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <Input
                    placeholder="Acme Inc."
                    {...register("companyName")}
                    className={`${inputCls} pl-10 ${errors.companyName ? "border-red-500/50" : ""}`}
                  />
                </div>
                <FieldError message={errors.companyName?.message} />
              </div>

              <div>
                <Label className={labelCls}>Industry</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 z-10" />
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`${inputCls} pl-10 ${errors.industry ? "border-red-500/50" : ""}`}>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="border-white/[0.08] bg-[#131518] text-white/80">
                          {INDUSTRIES.map(([v, label]) => (
                            <SelectItem 
                              key={v} 
                              value={v} 
                              className="focus:bg-[#639922]/10 focus:text-[#639922]"
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FieldError message={errors.industry?.message} />

                {isOtherSelected && (
                  <div className="mt-3 animate-in fade-in duration-200">
                    <div className="relative">
                      <Plus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                      <Input
                        placeholder="Please specify your industry (e.g., Retail, Logistics, Mining...)"
                        {...register("customIndustry")}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    <p className="text-[10px] text-white/25 mt-1 ml-1">
                      Enter a custom industry name
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 mt-4">
                <p className="text-xs text-white/35 text-center">
                  After account creation, you'll be able to add more details like company size, 
                  logo, and complete your company profile.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className={`flex flex-col sm:flex-row gap-3 mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="order-2 sm:order-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-white/45 hover:text-white/70 hover:border-white/[0.14] transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        <div className="flex-1">
          {isLastStep ? (
            <button
              type="submit"
              disabled={isLoading || !canSubmitStep2()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#639922]/30 bg-[#639922]/15 px-4 py-2.5 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/25 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Create Account</>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              disabled={step === 0 ? !canGoNextFromStep0() : !canGoNextFromStep1()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#639922]/30 bg-[#639922]/15 px-4 py-2.5 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/25 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/20 mt-4 font-mono">
        Step {step + 1} of 3
      </p>
    </form>
  );
}