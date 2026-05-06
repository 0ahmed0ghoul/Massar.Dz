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
import { RoleSelector } from "../components/RoleSelector";
import { VerificationStep } from "../components/VerificationStep";
import { StudentForm } from "../components/forms/StudentForm";
import { CompanyForm } from "../components/forms/CompanyForm";
import { UniversityForm } from "../components/forms/UniversityForm";
import { UserRole } from "@/domain/profile.types";

const META: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: "Candidate",
    description: "Find internships and jobs",
  },
  company_admin: {
    title: "Company Admin",
    description: "Post jobs and manage candidates",
  },
  university_admin: {
    title: "University (Pending)",
    description: "",
  },
  super_admin: {
    title: "Super Admin",
    description: "Full system control",
  },
  graduate: {
    title: "Graduate",
    description: "Explore career opportunities",
  },
  professional: {
    title: "Professional",
    description: "Advance your career",
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
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.4)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.4)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* VERIFY STEP */}
        {step === "verify" && (
          <VerificationStep
            email={pendingEmail}
            code={verificationCode}
            isLoading={isLoading}
            resendCooldown={resendCooldown}
            onCodeChange={setVerificationCode}
            onVerify={handleVerify}
            onResend={() => handleResendCode(pendingEmail)}
            onBack={() => setStep("form")}
          />
        )}

        {/* MAIN CARD */}
        {step !== "verify" && (
          <Card className="border border-border bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border text-center">
              {step === "form" && (
                <button
                  onClick={() => setStep("role")}
                  className="absolute left-4 top-4 text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              <div className="mx-auto mb-3">
                <Link to="/">
                  <img
                    src={MassarLogo}
                    className="h-10 w-10"
                    alt="Massar Logo"
                  />
                </Link>
              </div>

              <CardTitle className="text-foreground bg-transparent">
                {step === "role" ? "Create account" : meta?.title}
              </CardTitle>

              <CardDescription className="text-muted-foreground">
                {step === "role" ? "Choose your role" : meta?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* ROLE SELECTION */}
              {/* ROLE SELECTION */}
              {step === "role" && (
                <RoleSelector
                  selectedRole={role}
                  onRoleSelect={handleRoleSelect}
                />
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

        <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground/60">
          <div className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground transition-colors hover:text-foreground/80 hover:underline"
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
