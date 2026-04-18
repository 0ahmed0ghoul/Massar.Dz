// hooks/useRegister.ts
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";
import { useVerification } from "./useVerification";
import type { UserRole } from "@/constants/roles";

type Step = "role" | "form" | "verify";

export interface RegisterFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  degreeLevel?: string;
  companyName?: string;
  industry?: string;
  universityName?: string;
  city?: string;
}

function normalizeError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (msg.includes("already registered") || msg.includes("duplicate")) {
      return "This email is already registered. Try logging in.";
    }

    if (msg.includes("429")) {
      return "Too many attempts. Please wait a moment.";
    }

    return err.message;
  }

  return "Something went wrong. Please try again.";
}

export const useRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const pendingFormDataRef = useRef<RegisterFormData | null>(null);
  const isSubmittingRef = useRef(false);

  const {
    sendVerificationCode,
    verifyCode,
    handleResendCode,
    resendCooldown,
  } = useVerification();

  // ─── ROLE ─────────────────────────────
  const handleRoleSelect = (r: UserRole) => {
    console.log("🟢 ROLE SELECTED:", r);
    setRole(r);
    setStep("form");
  };

  // ─── STEP 1: FORM → VALIDATE + SEND OTP ─────────────────────────────
  const handleFormSubmit = async (data: RegisterFormData) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // 🔴 VALIDATION FIRST
      if (!data.email || !data.email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      if (!data.password || data.password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (!role) {
        throw new Error("Please select a role.");
      }

      // 🔴 CHECK IF EMAIL ALREADY EXISTS (optional but smart)
      const exists = await authService.checkEmailExists(data.email);
      if (exists) {
        throw new Error("Email already registered. Please login.");
      }

      // ✅ SAVE DATA
      pendingFormDataRef.current = data;

      // ✅ SEND OTP ONLY
      await sendVerificationCode(data.email);

      setVerificationCode("");
      setStep("verify");

      toast({
        title: "Code sent",
        description: "Check your email inbox.",
      });

    } catch (err: unknown) {
      toast({
        title: "Error",
        description: normalizeError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // ─── STEP 2: VERIFY → REGISTER ─────────────────────────────
  const handleVerify = async () => {
    const formData = pendingFormDataRef.current;

    if (!role || !formData || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // 🔴 VERIFY CODE FIRST
      const { valid, error } = verifyCode(formData.email, verificationCode);
      if (!valid) throw new Error(error);

      console.log("🚀 FINAL REGISTER:", formData);

      // ✅ REGISTER ONLY HERE (ONCE)
      const user = await authService.registerUser({
        email: formData.email,
        password: formData.password,
        role,
        profile: formData,
      });

      if (!user) throw new Error("User creation failed.");

      toast({
        title: "Success!",
        description: "Account created successfully.",
      });

      // ✅ REDIRECT
      if (role === "student") {
        navigate("/student/dashboard");
      } else if (
        role === "company_admin" ||
        role === "university_admin"
      ) {
        navigate("/pending-approval");
      } else {
        navigate("/");
      }

    } catch (err: unknown) {
      toast({
        title: "Verification failed",
        description: normalizeError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return {
    step,
    role,
    isLoading,
    verificationCode,
    resendCooldown,
    pendingEmail: pendingFormDataRef.current?.email ?? "",

    setVerificationCode,
    setStep,

    handleRoleSelect,
    handleFormSubmit,
    handleVerify,
    handleResendCode,
  };
};