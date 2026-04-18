import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MassarLogo from "@/assets/Logo-icon.jpg";

import { useRegister } from "../hooks/useRegister";
import { UserRole } from "@/constants/roles";

import { RoleSelector } from "../components/RoleSelector";
import { VerificationStep } from "../components/VerificationStep";
import { StudentForm } from "../components/forms/StudentForm";
import { CompanyForm } from "../components/forms/CompanyForm";
import { UniversityForm } from "../components/forms/UniversityForm";

const META: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: "Student",
    description: "Find internships and jobs",
  },
  company_admin: {
    title: "Company Admin",
    description: "Post jobs and manage candidates",
  },
  university_admin: {
    title: "University (Pending)",
    description: "Awaiting verification",
  },
  super_admin: {
    title: "Super Admin",
    description: "Full system control",
  },
};

const Register = () => {
  const {
    step,
    role,
    isLoading,
    verificationCode,
    resendCooldown,
    pendingEmail,
    setVerificationCode,
    setStep,
    handleRoleSelect,
    handleFormSubmit,
    handleVerify,
    handleResendCode,
  } = useRegister();

  const meta = role ? META[role] : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0e] p-4 overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">


        {/* VERIFY STEP */}
        {step === "verify" && (
          <VerificationStep
            email={pendingEmail} // ← was hardcoded ""
            code={verificationCode}
            isLoading={isLoading}
            resendCooldown={resendCooldown}
            onCodeChange={setVerificationCode}
            onVerify={handleVerify} // ← no formData arg anymore
            onResend={() => handleResendCode(pendingEmail)} // ← passes real email
            onBack={() => setStep("form")}
          />
        )}

        {/* MAIN CARD */}
        {step !== "verify" && (
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="text-center border-b border-white/10">
              {step === "form" && (
                <button
                  onClick={() => setStep("role")}
                  className="absolute left-4 top-4 text-white/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              <div className="mx-auto mb-3">
                <img src={MassarLogo} className="w-10 h-10" />
              </div>

              <CardTitle className="text-white">
                {step === "role" ? "Create account" : meta?.title}
              </CardTitle>

              <CardDescription className="text-white/40">
                {step === "role" ? "Choose your role" : meta?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* ROLE */}
              {step === "role" && (
                <RoleSelector selected={role} onSelect={handleRoleSelect} />
              )}

              {/* FORMS */}
              {step === "form" && role === "student" && (
                <StudentForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              )}

              {step === "form" && role === "company_admin" && (
                <CompanyForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              )}

              {step === "form" && role === "university_admin" && (
                <UniversityForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              )}
            </CardContent>
          </Card>
        )}
        <div className="mt-6 text-center text-xs text-white/30 space-y-2">
          <div>By continuing you agree to Terms & Privacy</div>

          <div className="text-sm text-white/40">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline hover:text-white/80 transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
