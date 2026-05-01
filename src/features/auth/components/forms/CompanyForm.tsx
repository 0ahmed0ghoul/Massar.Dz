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
import { useState } from "react";

interface CompanyFormProps {
  isLoading: boolean;
  onSubmit: (data: CompanyFields) => void;
}

const labelCls = "text-muted-foreground text-xs font-medium uppercase tracking-wider";
const inputCls = "border-border bg-card/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20";
const errorInputCls = "border-destructive/50 focus:border-destructive/70";

const INDUSTRIES = [
  ["technology", "Technology"],
  ["finance",    "Finance"],
  ["healthcare", "Healthcare"],
  ["education",  "Education"],
  ["other",      "Other"],
] as const;

const COMPANY_TYPES = [
  ["startup", "Startup"],
  ["private", "Private Company"],
  ["government", "Government Entity"],
] as const;

export function CompanyForm({ isLoading, onSubmit }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CompanyFields>({ resolver: zodResolver(companySchema) });

  const selectedIndustry = watch("industry");
  const [customIndustry, setCustomIndustry] = useState("");

  const isOtherSelected = selectedIndustry === "other";

  const handleFormSubmit = (data: CompanyFields) => {
    let finalIndustry = data.industry;
    if (data.industry === "other" && customIndustry.trim()) {
      finalIndustry = customIndustry.trim();
    }
    onSubmit({ ...data, industry: finalIndustry });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
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

      {/* Company Type */}
      <div>
        <Label className={labelCls}>Company type</Label>
        <Controller
          name="companyType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={`mt-1.5 border-border bg-card/30 text-foreground hover:bg-card/50 focus:ring-primary/20 ${errors.companyType ? errorInputCls : ""}`}>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {COMPANY_TYPES.map(([v, label]) => (
                  <SelectItem key={v} value={v} className="focus:bg-muted focus:text-foreground">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.companyType?.message} />
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

      {/* Industry with custom input */}
      <div>
        <Label className={labelCls}>Industry</Label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={`mt-1.5 border-border bg-card/30 text-foreground hover:bg-card/50 focus:ring-primary/20 ${errors.industry ? errorInputCls : ""}`}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {INDUSTRIES.map(([v, label]) => (
                  <SelectItem key={v} value={v} className="focus:bg-muted focus:text-foreground">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.industry?.message} />

        {isOtherSelected && (
          <div className="mt-2">
            <Input
              placeholder="Please specify your industry (e.g., Retail, Logistics, Mining...)"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              className={inputCls}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Enter a custom industry name
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group"
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