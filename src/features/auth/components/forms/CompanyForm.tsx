import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import { companySchema, CompanyFields } from "../../schemas/auth.schemas";

interface CompanyFormProps {
  isLoading: boolean;
  onSubmit: (data: CompanyFields) => void;
}

const labelCls = "text-white/60 text-xs font-medium uppercase tracking-wider";
const inputCls = "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10";
const errorInputCls = "border-red-500/50 focus:border-red-500/70";

const INDUSTRIES = [
  ["technology", "Technology"],
  ["finance",    "Finance"],
  ["healthcare", "Healthcare"],
  ["education",  "Education"],
  ["other",      "Other"],
] as const;

export function CompanyForm({ isLoading, onSubmit }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanyFields>({ resolver: zodResolver(companySchema) });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Company name */}
      <div>
        <Label className={labelCls}>Company name</Label>
        <Input
          placeholder="Acme Inc."
          {...register("companyName")}
          className={`mt-1.5 ${inputCls} ${errors.companyName ? errorInputCls : ""}`}
        />
        <FieldError message={errors.companyName?.message} />
      </div>

      {/* Admin name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={labelCls}>First name</Label>
          <Input
            placeholder="John"
            {...register("firstName")}
            className={`mt-1.5 ${inputCls} ${errors.firstName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label className={labelCls}>Last name</Label>
          <Input
            placeholder="Smith"
            {...register("lastName")}
            className={`mt-1.5 ${inputCls} ${errors.lastName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Work email */}
      <div>
        <Label className={labelCls}>Work email</Label>
        <Input
          type="email"
          placeholder="john@acme.com"
          {...register("email")}
          className={`mt-1.5 ${inputCls} ${errors.email ? errorInputCls : ""}`}
        />
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

      {/* Industry */}
      <div>
        <Label className={labelCls}>Industry</Label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={`mt-1.5 border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-white/10 ${errors.industry ? errorInputCls : ""}`}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0b0c0e] text-white">
                {INDUSTRIES.map(([v, label]) => (
                  <SelectItem key={v} value={v} className="focus:bg-white/10 focus:text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.industry?.message} />
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
            <span>Continue</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}