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
import { studentSchema, StudentFields } from "../../schemas/auth.schemas";

interface StudentFormProps {
  isLoading: boolean;
  onSubmit: (data: StudentFields) => void;
}

const labelCls = "text-muted-foreground text-xs font-medium uppercase tracking-wider";
const inputCls = "border-border bg-card/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20";
const errorInputCls = "border-destructive/50 focus:border-destructive/70";

export function StudentForm({ isLoading, onSubmit }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentFields>({ resolver: zodResolver(studentSchema) });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={labelCls}>First name</Label>
          <Input
            placeholder="Jane"
            {...register("firstName")}
            className={`mt-1.5 ${inputCls} ${errors.firstName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label className={labelCls}>Last name</Label>
          <Input
            placeholder="Doe"
            {...register("lastName")}
            className={`mt-1.5 ${inputCls} ${errors.lastName ? errorInputCls : ""}`}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label className={labelCls}>Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
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

      {/* Degree */}
      <div>
        <Label className={labelCls}>Degree level</Label>
        <Controller
          name="degreeLevel"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={`mt-1.5 border-border bg-card/30 text-foreground hover:bg-card/50 focus:ring-primary/20 ${errors.degreeLevel ? errorInputCls : ""}`}>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {[
                  ["bachelor", "Bachelor's"],
                  ["master",   "Master's"],
                  ["phd",      "PhD"],
                  ["bootcamp", "Bootcamp"],
                ].map(([v, label]) => (
                  <SelectItem key={v} value={v} className="focus:bg-muted focus:text-foreground">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.degreeLevel?.message} />
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