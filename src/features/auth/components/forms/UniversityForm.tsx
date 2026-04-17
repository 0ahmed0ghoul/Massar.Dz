import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import { universitySchema, UniversityFields } from "../../schemas/auth.schemas";

interface UniversityFormProps {
  isLoading: boolean;
  onSubmit: (data: UniversityFields) => void;
}

const labelCls = "text-white/60 text-xs font-medium uppercase tracking-wider";
const inputCls = "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10";
const errorInputCls = "border-red-500/50 focus:border-red-500/70";

export function UniversityForm({ isLoading, onSubmit }: UniversityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UniversityFields>({ resolver: zodResolver(universitySchema) });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-400/80 leading-relaxed">
          University accounts require manual review before activation.
          You'll be notified once approved.
        </p>
      </div>

      {/* University name */}
      <div>
        <Label className={labelCls}>University name</Label>
        <Input
          placeholder="MIT"
          {...register("universityName")}
          className={`mt-1.5 ${inputCls} ${errors.universityName ? errorInputCls : ""}`}
        />
        <FieldError message={errors.universityName?.message} />
      </div>

      {/* Admin name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={labelCls}>Admin first name</Label>
          <Input
            placeholder="Jane"
            {...register("firstName")}
            className={`mt-1.5 ${inputCls} ${errors.firstName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label className={labelCls}>Admin last name</Label>
          <Input
            placeholder="Doe"
            {...register("lastName")}
            className={`mt-1.5 ${inputCls} ${errors.lastName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Institutional email */}
      <div>
        <Label className={labelCls}>Institutional email</Label>
        <Input
          type="email"
          placeholder="admin@university.edu"
          {...register("email")}
          className={`mt-1.5 ${inputCls} ${errors.email ? errorInputCls : ""}`}
        />
        {!errors.email && (
          <p className="mt-1 text-[11px] text-white/30">
            Use your institution's official email address.
          </p>
        )}
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div>
        <Label className={labelCls}>Password</Label>
        <PasswordInput
          id="password"
          {...register("password")}
          className={`mt-1.5 ${errors.password ? errorInputCls : ""}`}
        />
        <FieldError message={errors.password?.message} />
      </div>

      {/* City */}
      <div>
        <Label className={labelCls}>City</Label>
        <Input
          placeholder="Cambridge"
          {...register("city")}
          className={`mt-1.5 ${inputCls} ${errors.city ? errorInputCls : ""}`}
        />
        <FieldError message={errors.city?.message} />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 group"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Submit for Review</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}