import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MassarLogo from "@/assets/Logo-icon.jpg";



import { RoleSelector } from "../components/RoleSelector";
import { VerificationStep } from "../components/VerificationStep";
import { StudentForm } from "../components/forms/StudentForm";
import { CompanyForm } from "../components/forms/CompanyForm";
import { UniversityForm } from "../components/forms/UniversityForm";

// ─── Step type ────────────────────────────────────────────────────────────────

type Step = "role" | "form" | "verify";

// ─── Default form data ────────────────────────────────────────────────────────

const defaultStudent: StudentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  degreeLevel: "",
};

const defaultCompany: CompanyFormData = {
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  industry: "",
};

const defaultUniversity: UniversityFormData = {
  universityName: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  city: "",
};

// ─── Page meta ────────────────────────────────────────────────────────────────

const META: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: "Student",
    description: "Find internships and jobs",
  },
  company_admin: {
    title: "Company Admin",
    description: "Post jobs and manage candidates",
  },
  pending_university: {
    title: "University (Pending)",
    description: "Awaiting verification",
  },
  university_admin: {
    title: "University Admin",
    description: "Manage students and programs",
  },
  super_admin: {
    title: "Super Admin",
    description: "Full system control",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Step & role state ─────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole | null>(null);

  // ── Form data ─────────────────────────────────────────────────────────────
  const [studentData, setStudentData] = useState<StudentFormData>(defaultStudent);
  const [companyData, setCompanyData] = useState<CompanyFormData>(defaultCompany);
  const [universityData, setUniversityData] =
    useState<UniversityFormData>(defaultUniversity);

  // ── Verification state ────────────────────────────────────────────────────
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendVerificationCode, verifyCode, handleResendCode, resendCooldown } =
    useVerification();

  // ── Helpers ───────────────────────────────────────────────────────────────

  const currentEmail =
    role === "student"
      ? studentData.email
      : role === "company_admin"
      ? companyData.email
      : universityData.email;

  /** Generic onChange for text inputs (works for any form via id matching). */
  function makeChangeHandler<T>(
    setter: React.Dispatch<React.SetStateAction<T>>
  ) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
  
      setter((prev) => ({
        ...prev,
        [id]: value,
      } as T));
    };
  }
  /** Generic onSelectChange for shadcn <Select>. */
  function makeSelectHandler<T>(
    setter: React.Dispatch<React.SetStateAction<T>>
  ) {
    return (field: keyof T, value: string) => {
      setter((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  // ── Step handlers ─────────────────────────────────────────────────────────

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep("form");
  };

  /** Validate form, check for duplicate email, then send verification code. */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setIsLoading(true);

    try {
      const email = currentEmail;

      // Basic email validation
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address.");
      }

      // Check for duplicate
      const exists = await authService.checkEmailExists(email);
      if (exists) {
        throw new Error("An account with this email already exists.");
      }

      // Send OTP
      await sendVerificationCode(email);
      setVerificationCode("");
      setStep("verify");

      toast({
        title: "Code Sent",
        description: "Check your inbox for the 6-digit verification code.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** Verify OTP, create account, redirect. */
  const handleVerify = async () => {
    if (!role) return;
    setIsLoading(true);

    try {
      // 1. Validate code locally
      const { valid, error } = verifyCode(currentEmail, verificationCode);
      if (!valid) throw new Error(error);

      // 2. Create account based on role
      if (role === "student") {
        await authService.registerStudent(studentData);
        toast({ title: "Welcome!", description: "Your account is ready." });
        navigate("/student/dashboard");
      } else if (role === "company_admin") {
        await authService.registerCompany(companyData);
        toast({
          title: "Application Submitted",
          description: "We'll review your request and notify you by email.",
        });
        navigate("/pending-approval");
      } else {
        // pending_university → pending approval page
        await authService.registerUniversity(universityData);
        toast({
          title: "Application Submitted",
          description: "We'll review your request and notify you by email.",
        });
        navigate("/pending-approval");
      }
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const meta = role ? META[role] : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0e] p-4 overflow-hidden">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-xl text-white transition-all hover:opacity-80"
          >
            <div className="rounded-lg bg-white/10 p-1.5">
              <img src={MassarLogo} alt="Massar Logo" className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Massar
            </span>
          </Link>
        </div>

        {/* ── Verification step ─────────────────────────────────────────── */}
        {step === "verify" && (
          <VerificationStep
            email={currentEmail}
            code={verificationCode}
            isLoading={isLoading}
            resendCooldown={resendCooldown}
            onCodeChange={setVerificationCode}
            onVerify={handleVerify}
            onResend={() => handleResendCode(currentEmail)}
            onBack={() => {
              setStep("form");
              setVerificationCode("");
            }}
          />
        )}

        {/* ── Role selector & form steps ────────────────────────────────── */}
        {step !== "verify" && (
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center border-b border-white/10 pb-6">
              {/* Back button (form step only) */}
              {step === "form" && (
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="absolute left-6 top-6 text-white/40 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <img src={MassarLogo} alt="" className="w-10 h-10 rounded-full" />
              </div>

              <CardTitle className="text-2xl text-white">
                {step === "role" ? "Create your account" : meta?.title}
              </CardTitle>
              <CardDescription className="text-white/40">
                {step === "role"
                  ? "Choose how you want to use Massar"
                  : meta?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* ── Role selection ──────────────────────────────────────── */}
              {step === "role" && (
                <>
                  <RoleSelector selected={role} onSelect={handleRoleSelect} />
                  <p className="mt-6 text-center text-sm text-white/40">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-white hover:underline transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              )}

              {/* ── Student form ────────────────────────────────────────── */}
              {step === "form" && role === "student" && (
                <>
                  <StudentForm
                    data={studentData}
                    isLoading={isLoading}
                    onChange={makeChangeHandler(setStudentData)}
                    onSelectChange={makeSelectHandler(setStudentData)}
                    onSubmit={handleFormSubmit}
                  />
                  <GoogleButton isLoading={isLoading}/>
                </>
              )}

              {/* ── Company form ────────────────────────────────────────── */}
              {step === "form" && role === "company_admin" && (
                <>
                  <CompanyForm
                    data={companyData}
                    isLoading={isLoading}
                    onChange={makeChangeHandler(setCompanyData)}
                    onSelectChange={makeSelectHandler(setCompanyData)}
                    onSubmit={handleFormSubmit}
                  />
                </>
              )}

              {/* ── University form ─────────────────────────────────────── */}
              {step === "form" && role === "pending_university" && (
                <UniversityForm
                  data={universityData}
                  isLoading={isLoading}
                  onChange={makeChangeHandler(setUniversityData)}
                  onSubmit={handleFormSubmit}
                />
              )}

              {/* Terms */}
              {step === "form" && (
                <p className="mt-4 text-center text-xs text-white/30">
                  By signing up you agree to our{" "}
                  <Link to="/terms" className="text-white/50 hover:text-white transition-colors">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats row */}
        <div className="mt-6 flex justify-center gap-6 text-center">
          {[
            { value: "2,400+", label: "Active Jobs" },
            { value: "45K+", label: "Students" },
            { value: "120+", label: "Universities" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-sm font-semibold text-white">{s.value}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Google OAuth button (shared between student & company) ───────────────────

import { supabase } from "@/lib/supabaseClient";
import { authService, CompanyFormData, StudentFormData, UniversityFormData } from "../service/auth.service";
import { useVerification } from "../hooks/useVerification";
import { UserRole } from "@/constants/roles";

function GoogleButton({ isLoading }: { isLoading: boolean }) {
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({
        title: "Google Sign Up Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-transparent px-2 text-xs text-white/30">or</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all duration-300"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>
    </>
  );
}

export default Register;
