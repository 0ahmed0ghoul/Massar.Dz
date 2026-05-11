import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import { universitySchema, UniversityFields } from "../../schemas/auth.schemas";
import {
  ALGERIAN_WILAYAS,
} from "../../../../constants/algeria.constants";
import { SearchableSelect } from "../searchable-select";

interface UniversityFormProps {
  isLoading: boolean;
  onSubmit: (data: UniversityFields) => void;
}

const labelCls =
  "text-muted-foreground text-xs font-medium uppercase tracking-wider";
const inputCls =
  "border-border bg-card/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20";
const errorInputCls = "border-destructive/50 focus:border-destructive/70";

export function UniversityForm({ isLoading, onSubmit }: UniversityFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UniversityFields>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      wilaya: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(
        (data) => {
          console.log("FORM SUBMITTED ✅", data);
          onSubmit(data);
        },
        (errors) => {
          console.log("FORM ERRORS ❌", errors);
        }
      )}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={labelCls}>First name</Label>
          <Input
            placeholder="Jane"
            {...register("firstName")}
            className={`mt-1.5 ${inputCls} ${
              errors.firstName ? errorInputCls : ""
            }`}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label className={labelCls}>Last name</Label>
          <Input
            placeholder="Doe"
            {...register("lastName")}
            className={`mt-1.5 ${inputCls} ${
              errors.lastName ? errorInputCls : ""
            }`}
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
          <p className="mt-1 text-[11px] text-muted-foreground/60">
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

      {/* Wilaya - searchable select with Controller */}
      <div>
        <Label className={labelCls}>Wilaya *</Label>
        <div className="mt-1.5">
          <Controller
            name="wilaya"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                options={ALGERIAN_WILAYAS}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                onBlur={field.onBlur} // ✅ ADD THIS
                placeholder="Select or search your wilaya..."
                emptyMessage="No wilaya found."
              />
            )}
          />
        </div>
        <FieldError message={errors.wilaya?.message} />
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
            <span>Register</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
