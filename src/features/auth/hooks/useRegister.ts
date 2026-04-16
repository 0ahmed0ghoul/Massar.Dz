import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";
import { useVerification } from "./useVerification";
import type { UserRole } from "@/constants/roles";

export const useRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"role" | "form" | "verify">("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    sendVerificationCode,
    verifyCode,
    handleResendCode,
    resendCooldown,
  } = useVerification();

  // ─────────────────────────────────────
  // ROLE SELECT
  // ─────────────────────────────────────
  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep("form");
  };

  // ─────────────────────────────────────
  // STEP 1: SEND OTP
  // ─────────────────────────────────────
  const handleFormSubmit = async (email: string) => {
    setIsLoading(true);

    try {
      if (!email?.includes("@")) {
        throw new Error("Invalid email");
      }

      const exists = await authService.checkEmailExists(email);
      if (exists) throw new Error("Email already exists");

      await sendVerificationCode(email);

      setStep("verify");

      toast({
        title: "Verification code sent",
        description: "Check your email inbox",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────
  // STEP 2: VERIFY + REGISTER
  // ─────────────────────────────────────
  const handleVerify = async (formData: any) => {
    if (!role) return;

    setIsLoading(true);

    try {
      const { valid, error } = verifyCode(
        formData.email,
        verificationCode
      );

      if (!valid) throw new Error(error);

      // 🔥 SINGLE ENTRY POINT (IMPORTANT)
      await authService.registerUser({
        email: formData.email,
        password: formData.password,
        role,
        profile: formData,
      });

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      // 🔥 REDIRECT LOGIC
      switch (role) {
        case "student":
          navigate("/dashboard/student");
          break;

        case "company_admin":
        case "university_admin":
          navigate("/pending-approval");
          break;

        default:
          navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    role,
    isLoading,
    verificationCode,
    setVerificationCode,
    setStep,
    handleRoleSelect,
    handleFormSubmit,
    handleVerify,
    sendVerificationCode,
    handleResendCode,
    resendCooldown,
  };
};