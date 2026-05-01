import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Loader2,
  GraduationCap,
  Calendar,
  Building2,
  Sparkles,
} from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { FieldError } from "../FieldError";
import { studentSchema, StudentFields } from "../../schemas/auth.schemas";
import { SkillsInput } from "../skills-input";



type StudentStatus = "studying" | "graduated" | "self_taught";

interface StudentFormProps {
  isLoading: boolean;
  onSubmit: (data: StudentFields) => void;
}

const labelCls = "text-muted-foreground text-xs font-medium uppercase tracking-wider";
const inputCls = "border-border bg-card/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20";
const errorInputCls = "border-destructive/50 focus:border-destructive/70";

export function StudentForm({ isLoading, onSubmit }: StudentFormProps) {
  const [status, setStatus] = useState<StudentStatus>("studying");
  const [skills, setSkills] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<StudentFields>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      degreeLevel: undefined,
      university: "",
      department: "",
      degree: "",
      graduationYear: "",
      speciality: "",
      skills: [],
      candidateType: "studying",
    },
  });

  const handleStatusChange = (newStatus: StudentStatus) => {
    setStatus(newStatus);
    setValue("candidateType", newStatus); 
    if (newStatus === "studying") {
      setValue("university", "");
      setValue("degree", "");
      setValue("graduationYear", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "degree", "graduationYear", "skills"]);
    } else if (newStatus === "graduated") {
      setValue("university", "");
      setValue("department", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "department", "skills"]);
    } else {
      // self_taught
      setValue("university", "");
      setValue("department", "");
      setValue("degree", "");
      setValue("graduationYear", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "department", "degree", "graduationYear"]);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Status Toggle */}
      <div className="space-y-2">
        <Label className={labelCls}>Your learning path</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "studying", label: "Currently Studying", icon: GraduationCap },
            { id: "graduated", label: "Graduated", icon: Calendar },
            { id: "self_taught", label: "Self‑Taught", icon: Sparkles },
          ].map((option) => {
            const isActive = status === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleStatusChange(option.id as StudentStatus)}
                className={`relative flex flex-col items-center gap-1 rounded-xl border p-3 transition-all duration-200
                  ${
                    isActive
                      ? "border-primary/60 bg-primary/10 shadow-md shadow-primary/10"
                      : "border-border bg-card/30 hover:bg-card/50 hover:border-border/70"
                  }`}
              >
                <option.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name row */}
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

      {/* Dynamic fields based on status */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {status === "studying" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelCls}>University / Institution *</Label>
                  <div className="relative mt-1.5">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="University of Algiers"
                      className={`pl-9 ${inputCls} ${
                        errors.university ? errorInputCls : ""
                      }`}
                      {...register("university")}
                    />
                  </div>
                  <FieldError message={errors.university?.message} />
                </div>
                <div>
                  <Label className={labelCls}>Department / Faculty</Label>
                  <Input
                    placeholder="Computer Science"
                    {...register("department")}
                    className={`mt-1.5 ${inputCls} ${
                      errors.department ? errorInputCls : ""
                    }`}
                  />
                  <FieldError message={errors.department?.message} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelCls}>Current Education Level *</Label>
                  <Controller
                    name="degreeLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`mt-1.5 border-border bg-card/30 ${
                            errors.degreeLevel ? errorInputCls : ""
                          }`}
                        >
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            ["bachelor", "Bachelor's"],
                            ["master", "Master's"],
                            ["phd", "PhD"],
                            ["bootcamp", "Bootcamp"],
                          ].map(([v, label]) => (
                            <SelectItem key={v} value={v}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.degreeLevel?.message} />
                </div>
                <div>
                  <Label className={labelCls}>Expected Graduation Year</Label>
                  <Input
                    placeholder="2025"
                    {...register("graduationYear")}
                    className={`mt-1.5 ${inputCls} ${
                      errors.graduationYear ? errorInputCls : ""
                    }`}
                  />
                  <FieldError message={errors.graduationYear?.message} />
                </div>
              </div>

              {/* Optional skills for students */}
              <div>
                <Label className={labelCls}>Skills (optional)</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <SkillsInput
                      value={field.value || []}
                      onChange={(skillsArray) => {
                        field.onChange(skillsArray);
                        setSkills(skillsArray);
                      }}
                      placeholder="e.g., React, Python, Leadership"
                      className="mt-1.5"
                    />
                  )}
                />
                <FieldError message={errors.skills?.message} />
              </div>
            </>
          )}

          {status === "graduated" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelCls}>University *</Label>
                  <div className="relative mt-1.5">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="University of Algiers"
                      className={`pl-9 ${inputCls} ${
                        errors.university ? errorInputCls : ""
                      }`}
                      {...register("university")}
                    />
                  </div>
                  <FieldError message={errors.university?.message} />
                </div>
                <div>
                  <Label className={labelCls}>Degree *</Label>
                  <Input
                    placeholder="Bachelor's in Computer Science"
                    {...register("degree")}
                    className={`mt-1.5 ${inputCls} ${
                      errors.degree ? errorInputCls : ""
                    }`}
                  />
                  <FieldError message={errors.degree?.message} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelCls}>speciality / Field</Label>
                  <Input
                    placeholder="Artificial Intelligence"
                    {...register("speciality")}
                    className={`mt-1.5 ${inputCls} ${
                      errors.speciality ? errorInputCls : ""
                    }`}
                  />
                  <FieldError message={errors.speciality?.message} />
                </div>
                <div>
                  <Label className={labelCls}>Graduation Year *</Label>
                  <Input
                    placeholder="2023"
                    {...register("graduationYear")}
                    className={`mt-1.5 ${inputCls} ${
                      errors.graduationYear ? errorInputCls : ""
                    }`}
                  />
                  <FieldError message={errors.graduationYear?.message} />
                </div>
              </div>

              {/* Optional skills for graduates */}
              <div>
                <Label className={labelCls}>Skills (optional)</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <SkillsInput
                      value={field.value || []}
                      onChange={(skillsArray) => {
                        field.onChange(skillsArray);
                        setSkills(skillsArray);
                      }}
                      placeholder="e.g., JavaScript, Project Management"
                      className="mt-1.5"
                    />
                  )}
                />
                <FieldError message={errors.skills?.message} />
              </div>
            </>
          )}

          {status === "self_taught" && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">
                Self‑taught & independent learners
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tell us about your technical skills (press Enter or comma to
                add)
              </p>
              <div className="mt-3">
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <SkillsInput
                      value={field.value || []}
                      onChange={(skillsArray) => {
                        field.onChange(skillsArray);
                        setSkills(skillsArray);
                      }}
                      placeholder="e.g., React, Python, UX Design"
                    />
                  )}
                />
                <FieldError message={errors.skills?.message} />
                <p className="text-[10px] text-muted-foreground mt-2">
                  Add your key technical or soft skills
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground transition-all duration-300 group"
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