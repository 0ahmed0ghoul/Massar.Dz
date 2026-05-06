// hooks/useRegister.ts
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useVerification } from "./useVerification";
import { CompanyType, UserRole } from "@/types/profile.types";
import { authService } from "../service/auth.service";

type Step = "role" | "form" | "verify";

export interface RegisterFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  degreeLevel?: string;
  companyName?: string;
  companyType?: CompanyType;  // ✅ added
  industry?: string;
  universityName?: string;
  wilaya?: string;
  // additional fields for other roles
  department?: string;
  position?: string;
  graduationYear?: string;
  university?: string;
  degree?: string;
  speciality?: string;
  skills?: string[];
  currentRole?: string;
  company?: string;
  yearsOfExperience?: string;
  lookingFor?: string;
  registrationNumber?: string;
  location?: string;
}
type BaseFormData = Partial<RegisterFormData>;
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
  const [roleType, setRoleType] = useState<CompanyType | null>(null);
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

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep("form");
  };

  const handleRoleTypeSelect = (type: CompanyType) => {
    setRoleType(type);
  };

  const handleFormSubmit = async (data: BaseFormData) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    // Merge roleType into data for company_admin
    const formDataWithType = { ...data };
    if (role === "company_admin" && roleType) {
      formDataWithType.companyType = roleType;
    }

    // Save pending profile to localStorage
    const pendingProfile = {
      email: data.email,
      role: role,
      roleType: roleType,
      profileData: formDataWithType,
      timestamp: Date.now(),
    };
    localStorage.setItem("pending_profile", JSON.stringify(pendingProfile));

    try {
      if (!data.email || !data.email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (!data.password || data.password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      if (!role) {
        throw new Error("Please select a role.");
      }

      const exists = await authService.checkEmailExists(data.email);
      if (exists) {
        throw new Error("Email already registered. Please login.");
      }

      const strictData: RegisterFormData = {
        ...formDataWithType,
        email: data.email!,       // safe after validation
        password: data.password!, // safe after validation
      };
      
      pendingFormDataRef.current = strictData;
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

  const handleVerify = async () => {
    const formData = pendingFormDataRef.current;
    if (!role || !formData || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const { valid, error } = verifyCode(formData.email, verificationCode);
      if (!valid) throw new Error(error);

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

      localStorage.removeItem("pending_profile");

      if (role === "student") {
        navigate("/student/dashboard");
      } else if (role === "company_admin" || role === "university_admin") {
        navigate("/complete-profile");
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
    roleType,
    isLoading,
    verificationCode,
    resendCooldown,
    pendingEmail: pendingFormDataRef.current?.email ?? "",
    setVerificationCode,
    setStep,
    handleRoleSelect,
    handleRoleTypeSelect,
    handleFormSubmit,
    handleVerify,
    handleResendCode,
  };
};