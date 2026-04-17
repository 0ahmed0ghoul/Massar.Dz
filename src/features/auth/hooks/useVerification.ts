// hooks/useVerification.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 min
const RESEND_COOLDOWN_S = 60;

// ─── Storage helpers ──────────────────────────────────────────────────────────

function storageKey(email: string) {
  return `verification_${email}`;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeCode(email: string, code: string): void {
  localStorage.setItem(storageKey(email), code);
  localStorage.setItem(
    `${storageKey(email)}_expires`,
    String(Date.now() + CODE_EXPIRY_MS)
  );
}

function clearCode(email: string): void {
  localStorage.removeItem(storageKey(email));
  localStorage.removeItem(`${storageKey(email)}_expires`);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVerification() {
  const { toast } = useToast();
  const [resendCooldown, setResendCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up the countdown timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setResendCooldown(RESEND_COOLDOWN_S);

    intervalRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /** Generate, store, and send a verification code. Throws on send failure. */
  const sendVerificationCode = useCallback(
    async (email: string): Promise<void> => {
      const code = generateCode();
      storeCode(email, code);

      const sent = await authService.sendVerificationEmail(email, code);
      if (!sent) {
        // Roll back the stored code so the user can try again cleanly
        clearCode(email);
        throw new Error("Failed to send verification email. Please try again.");
      }
    },
    []
  );

  /** Validate the user-entered code against localStorage. */
  const verifyCode = useCallback(
    (email: string, inputCode: string): { valid: boolean; error?: string } => {
      const stored = localStorage.getItem(storageKey(email));
      const expiry = localStorage.getItem(`${storageKey(email)}_expires`);

      if (!stored || !expiry) {
        return { valid: false, error: "Code not found. Please request a new one." };
      }
      if (Date.now() > parseInt(expiry, 10)) {
        clearCode(email);
        return { valid: false, error: "Code has expired. Please request a new one." };
      }
      if (stored !== inputCode.trim()) {
        return { valid: false, error: "Invalid verification code." };
      }

      clearCode(email);
      return { valid: true };
    },
    []
  );

  /** Re-send a verification code, respecting the cooldown. */
  const handleResendCode = useCallback(
    async (email: string) => {
      if (resendCooldown > 0) {
        toast({
          title: "Please wait",
          description: `You can resend in ${resendCooldown}s`,
          variant: "destructive",
        });
        return;
      }

      try {
        await sendVerificationCode(email);
        startCooldown();
        toast({
          title: "Code sent",
          description: "A new verification code has been sent to your email.",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to resend code.";
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
    [resendCooldown, sendVerificationCode, startCooldown, toast]
  );

  return { sendVerificationCode, verifyCode, handleResendCode, resendCooldown };
}