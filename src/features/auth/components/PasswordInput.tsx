import React, { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ id = "password", ...props }, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        id={id}
        type={show ? "text" : "password"}
        placeholder="Min 8 characters"
        minLength={8}
        {...props}
        className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/30
                   focus:border-white/20 focus:ring-white/10 pr-10"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow((v) => !v)}
        className="absolute right-0 top-0 h-full px-3 text-foreground/40 hover:text-foreground hover:bg-white/10"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";