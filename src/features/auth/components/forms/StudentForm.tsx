// features/auth/components/StudentForm.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentForm } from "../../hooks/useStudentForm";

import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { StepStatus } from "./student/StudentFormStepStatus";
import { StepPersonal } from "./student/StudentFormStepPersonal";
import { StepAcademic } from "./student/StudentFormStepAcademic";
import { StepIndicator } from "./student/StudentFormStepIndicator";

type Step = 0 | 1 | 2;

export function StudentForm({ isLoading, onSubmit }: { isLoading: boolean; onSubmit: (data: any) => void }) {
  const {
    status,
    universities,
    availableDepartments,
    selectedUniversity,
    handleStatusChange,
    handleSubmit,
    register,
    control,
    errors,
    watch,
    setValue,
  } = useStudentForm(onSubmit);

  const [step, setStep] = useState<Step>(0);
  const [uniSearchOpen, setUniSearchOpen] = useState(false);
  const [deptSearchOpen, setDeptSearchOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);

  // Step 0: path selection
  const canGoNextFromStep0 = () => !!status;

  // Step 1: personal info
  const canGoNextFromStep1 = () => {
    const fn = watch("firstName");
    const ln = watch("lastName");
    const em = watch("email");
    const pw = watch("password");
    return !!(fn && ln && em && pw) &&
      !errors.firstName && !errors.lastName && !errors.email && !errors.password;
  };

  // Step 2: academic info
  const canSubmitStep2 = (): boolean => {
    if (status === "self_taught") return true;
    if (status === "studying") {
      return !!(
        watch("university") &&
        watch("department") &&
        watch("degreeLevel") &&
        watch("speciality") &&
        !errors.university &&
        !errors.department &&
        !errors.degreeLevel &&
        !errors.speciality
      );
    }
    if (status === "graduated") {
      return !!(
        watch("university") &&
        watch("department") &&
        watch("degree") &&
        watch("speciality") &&
        watch("graduationYear") &&
        !errors.university &&
        !errors.department &&
        !errors.degree &&
        !errors.speciality &&
        !errors.graduationYear
      );
    }
    return false;
  };

  const next = () => step < 2 && setStep((s) => (s + 1) as Step);
  const back = () => step > 0 && setStep((s) => (s - 1) as Step);
  const isLastStep = step === 2;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="h-0.5 w-full rounded-full bg-white/[0.06] mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#639922]/60 to-[#639922] transition-all duration-500"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="min-h-[360px]"
        >
          {step === 0 && <StepStatus status={status} onSelect={handleStatusChange} />}
          {step === 1 && <StepPersonal register={register} errors={errors} />}
          {step === 2 && (
            <StepAcademic
              status={status}
              control={control}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              universities={universities}
              availableDepartments={availableDepartments}
              selectedUniversity={selectedUniversity}
              uniSearchOpen={uniSearchOpen}
              setUniSearchOpen={setUniSearchOpen}
              deptSearchOpen={deptSearchOpen}
              setDeptSearchOpen={setDeptSearchOpen}
              specialityOpen={specOpen}
              setSpecialityOpen={setSpecOpen}
            />
          )}
        </motion.div>
      </AnimatePresence>

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