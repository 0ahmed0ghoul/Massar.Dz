import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_S = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    (Date.now() + CODE_EXPIRY_MS).toString()
  );
}

function clearCode(email: string): void {
  localStorage.removeItem(storageKey(email));
  localStorage.removeItem(`${storageKey(email)}_expires`);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVerification() {
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  /** Generate, store, and send a verification code. Always returns true (dev fallback logs to console). */
  const sendVerificationCode = useCallback(
    async (email: string): Promise<boolean> => {
      const code = generateCode();
      storeCode(email, code);

      const sent = await authService.sendVerificationEmail(email, code);

      if (!sent) {
        // Dev-mode fallback — never happens in production
        console.log(`[DEV] Verification code for ${email}: ${code}`);
        toast({
          title: "Development Mode",
          description: `Code: ${code} (check console)`,
        });
      }

      return true;
    },
    [toast]
  );

  /** Validate user-entered code against what is stored in localStorage. */
  const verifyCode = useCallback(
    (email: string, inputCode: string): { valid: boolean; error?: string } => {
      const stored = localStorage.getItem(storageKey(email));
      const expiry = localStorage.getItem(`${storageKey(email)}_expires`);

      if (!stored || !expiry) {
        return {
          valid: false,
          error: "Code not found. Please request a new one.",
        };
      }
      if (Date.now() > parseInt(expiry, 10)) {
        return {
          valid: false,
          error: "Code has expired. Please request a new one.",
        };
      }
      if (stored !== inputCode) {
        return { valid: false, error: "Invalid verification code." };
      }

      clearCode(email);
      return { valid: true };
    },
    []
  );

  /** Start the resend countdown timer. */
  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_S);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /** Re-send a verification code (respects cooldown). */
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

      await sendVerificationCode(email);
      startCooldown();
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    },
    [resendCooldown, sendVerificationCode, startCooldown, toast]
  );

  return { sendVerificationCode, verifyCode, handleResendCode, resendCooldown };
}
