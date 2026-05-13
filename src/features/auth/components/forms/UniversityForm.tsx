// features/auth/components/UniversityForm.tsx

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  ShieldCheck,
  GraduationCap,
  Landmark,
} from "lucide-react";

import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import { SearchableSelect } from "../searchable-select";

import {
  universitySchema,
  UniversityFields,
} from "../../schemas/auth.schemas";

import {
  ALGERIAN_WILAYAS,
} from "../../../../constants/algeria.constants";

type Step = 0 | 1 | 2;

interface UniversityFormProps {
  isLoading: boolean;
  onSubmit: (data: UniversityFields) => void;
}

const labelCls =
  "text-[11px] font-medium uppercase tracking-wider text-white/45";

const inputCls =
  "mt-1.5 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/80 placeholder:text-white/20 focus:border-[#639922]/35 focus:bg-[#639922]/[0.03] focus:ring-2 focus:ring-[#639922]/10 transition-all";

const errorInputCls =
  "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10";

export function UniversityForm({
  isLoading,
  onSubmit,
}: UniversityFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UniversityFields>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      wilaya: "",
      univ_admin_type: "",
    },
  });

  const [step, setStep] = useState<Step>(0);

  const selectedType = watch("univ_admin_type");

  // ─────────────────────────────────────────────
  // Validation per step
  // ─────────────────────────────────────────────

  const canGoNextStep0 = () => {
    return !!selectedType;
  };

  const canSubmit = () => {
    return !!(
      watch("firstName") &&
      watch("lastName") &&
      watch("email") &&
      watch("password") &&
      watch("wilaya") &&
      selectedType &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.password &&
      !errors.wilaya
    );
  };

  const next = () => {
    if (step < 2) setStep((prev) => (prev + 1) as Step);
  };

  const back = () => {
    if (step > 0) setStep((prev) => (prev - 1) as Step);
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Progress */}
      <div className="h-0.5 w-full rounded-full bg-white/[0.06] mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#639922]/60 to-[#639922] transition-all duration-500"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              step === s
                ? "w-10 bg-[#639922]"
                : step > s
                ? "w-6 bg-[#639922]/50"
                : "w-2.5 bg-white/10"
            }`}
          />
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
          {/* ───────────────── STEP 0 ───────────────── */}
          {step === 0 && (
            <div>
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl
                             border border-[#639922]/20 bg-[#639922]/10"
                >
                  <GraduationCap className="h-6 w-6 text-[#639922]" />
                </div>

                <h2 className="text-2xl font-bold text-white/90">
                  Choose your role
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Select the university administration type
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Head of Department */}
                <button
                  type="button"
                  onClick={() =>
                    setValue("univ_admin_type", "head_of_department")
                  }
                  className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                    selectedType === "head_of_department"
                      ? "border-[#639922]/35 bg-[#639922]/10 shadow-[0_4px_20px_rgba(99,153,34,0.12)]"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                        selectedType === "head_of_department"
                          ? "border-[#639922]/30 bg-[#639922]/15"
                          : "border-white/[0.08] bg-white/[0.04]"
                      }`}
                    >
                      <Building2
                        className={`h-5 w-5 ${
                          selectedType === "head_of_department"
                            ? "text-[#639922]"
                            : "text-white/40"
                        }`}
                      />
                    </div>

                    {selectedType === "head_of_department" && (
                      <CheckCircle2 className="h-5 w-5 text-[#639922]" />
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white/85">
                    Head of Department
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/35">
                    Manage and communicate with students inside a specific
                    department.
                  </p>
                </button>

                {/* Rectorate */}
                <button
                  type="button"
                  onClick={() => setValue("univ_admin_type", "rectorate")}
                  className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                    selectedType === "rectorate"
                      ? "border-[#639922]/35 bg-[#639922]/10 shadow-[0_4px_20px_rgba(99,153,34,0.12)]"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                        selectedType === "rectorate"
                          ? "border-[#639922]/30 bg-[#639922]/15"
                          : "border-white/[0.08] bg-white/[0.04]"
                      }`}
                    >
                      <Landmark
                        className={`h-5 w-5 ${
                          selectedType === "rectorate"
                            ? "text-[#639922]"
                            : "text-white/40"
                        }`}
                      />
                    </div>

                    {selectedType === "rectorate" && (
                      <CheckCircle2 className="h-5 w-5 text-[#639922]" />
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white/85">
                    University Rectorate
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/35">
                    Central university administration with full institutional
                    access.
                  </p>
                </button>
              </div>

              <FieldError message={errors.univ_admin_type?.message} />
            </div>
          )}

          {/* ───────────────── STEP 1 ───────────────── */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#639922]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white/90">
                      Personal information
                    </h2>

                    <p className="text-sm text-white/35">
                      Administrator account details
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Names */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className={labelCls}>First name</Label>

                    <Input
                      placeholder="Ahmed"
                      {...register("firstName")}
                      className={`${inputCls} ${
                        errors.firstName ? errorInputCls : ""
                      }`}
                    />

                    <FieldError message={errors.firstName?.message} />
                  </div>

                  <div>
                    <Label className={labelCls}>Last name</Label>

                    <Input
                      placeholder="Ghoul"
                      {...register("lastName")}
                      className={`${inputCls} ${
                        errors.lastName ? errorInputCls : ""
                      }`}
                    />

                    <FieldError message={errors.lastName?.message} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label className={labelCls}>Institutional email</Label>

                  <Input
                    type="email"
                    placeholder="admin@university.edu.dz"
                    {...register("email")}
                    className={`${inputCls} ${
                      errors.email ? errorInputCls : ""
                    }`}
                  />

                  <p className="mt-1 text-[11px] text-white/25">
                    Use your official university email address.
                  </p>

                  <FieldError message={errors.email?.message} />
                </div>

                {/* Password */}
                <div>
                  <Label className={labelCls}>Password</Label>

                  <PasswordInput
                    id="password"
                    {...register("password")}
                    className={`${inputCls} ${
                      errors.password ? errorInputCls : ""
                    }`}
                  />

                  <FieldError message={errors.password?.message} />
                </div>
              </div>
            </div>
          )}

          {/* ───────────────── STEP 2 ───────────────── */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    <Building2 className="h-5 w-5 text-[#639922]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white/90">
                      University details
                    </h2>

                    <p className="text-sm text-white/35">
                      Administrative institution information
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className={labelCls}>Wilaya</Label>

                <div className="mt-1.5">
                  <Controller
                    name="wilaya"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        options={ALGERIAN_WILAYAS}
                        value={field.value || ""}
                        onChange={(val) => field.onChange(val)}
                        onBlur={field.onBlur}
                        placeholder="Select or search your wilaya..."
                        emptyMessage="No wilaya found."
                      />
                    )}
                  />
                </div>

                <FieldError message={errors.wilaya?.message} />
              </div>

              {/* Selected role preview */}
              <div
                className="mt-6 rounded-2xl border border-[#639922]/15 bg-[#639922]/[0.05]
                           px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl
                               border border-[#639922]/20 bg-[#639922]/10"
                  >
                    {selectedType === "rectorate" ? (
                      <Landmark className="h-5 w-5 text-[#639922]" />
                    ) : (
                      <Building2 className="h-5 w-5 text-[#639922]" />
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/30">
                      Selected role
                    </p>

                    <p className="text-sm font-semibold text-white/80">
                      {selectedType === "rectorate"
                        ? "Rectorate"
                        : "Head of Department"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div
        className={`flex flex-col sm:flex-row gap-3 mt-8 ${
          step > 0 ? "justify-between" : "justify-end"
        }`}
      >
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="order-2 sm:order-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-white/45 hover:text-white/70 hover:border-white/[0.14] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <div className="flex-1">
          {step === 2 ? (
            <button
              type="submit"
              disabled={isLoading || !canSubmit()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#639922]/30 bg-[#639922]/15 px-4 py-2.5 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/25 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              disabled={step === 0 ? !canGoNextStep0() : false}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#639922]/30 bg-[#639922]/15 px-4 py-2.5 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/25 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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