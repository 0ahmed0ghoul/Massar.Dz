import { Input } from "@/components/ui/input";
import { User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "../../FieldError";
import { PasswordInput } from "../../PasswordInput";

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:border-[#639922]/40 focus:outline-none focus:ring-2 focus:ring-[#639922]/10 transition-all";
const errCls = "border-red-500/40 focus:border-red-500/50";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/25 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </p>
  );
}

export function StepPersonal({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white/85">Create your account</h2>
        <p className="text-[13px] text-white/35 mt-1">Your basic information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel required>First name</FieldLabel>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25" />
            <Input
              {...register("firstName")}
              placeholder="Youssef"
              className={cn("pl-9", errors.firstName && errCls)}
            />
          </div>
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <FieldLabel required>Last name</FieldLabel>
          <Input
            {...register("lastName")}
            placeholder="Frahitia"
            className={errors.lastName && errCls}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <FieldLabel required>Email address</FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25" />
          <Input
            type="email"
            {...register("email")}
            placeholder="youssef@example.com"
            className={cn("pl-9", errors.email && errCls)}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <FieldLabel required>Password</FieldLabel>
        <PasswordInput
          id="password"
          {...register("password")}
          className={errors.password ? errCls : ""}
        />
        <FieldError message={errors.password?.message} />
      </div>
    </div>
  );
}