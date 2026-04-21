import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface VerificationStepProps {
  email: string;
  code: string;
  isLoading: boolean;
  resendCooldown: number;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

export function VerificationStep({
  email,
  code,
  isLoading,
  resendCooldown,
  onCodeChange,
  onVerify,
  onResend,
  onBack,
}: VerificationStepProps) {
  return (
    <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center border-b border-white/10 pb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
          <CheckCircle className="h-5 w-5 text-foreground/60" />
        </div>
        <CardTitle className="text-2xl text-foreground">Verify Your Email</CardTitle>
        <CardDescription className="text-foreground/40">
          Enter the 6-digit code sent to{" "}
          <span className="text-foreground/60">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground/60 text-xs font-medium uppercase tracking-wider">
            Verification Code
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-widest border-white/10 bg-white/5 text-foreground
                       placeholder:text-foreground/30 focus:border-white/20 focus:ring-white/10"
            autoFocus
          />
        </div>

        <Button
          onClick={onVerify}
          disabled={isLoading || code.length !== 6}
          className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Verify & Create Account"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onResend}
            disabled={resendCooldown > 0}
            className="text-sm text-foreground/40 hover:text-foreground transition-colors disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </button>
        </div>

        <div className="text-center text-sm text-foreground/40">
          Wrong email?{" "}
          <button
            type="button"
            onClick={onBack}
            className="text-foreground hover:underline transition-colors"
          >
            Go back
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
