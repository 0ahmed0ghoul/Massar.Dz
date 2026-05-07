import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  CheckCircle2,
  Clock,
  ChevronsUpDown,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "../../FieldError";
import {
  ALGERIAN_UNIVERSITIES,
  ALGERIAN_WILAYAS,
} from "@/constants/algeria.constants";
import {
  COMMON_DEGREES,
  COMMON_SPECIALITIES,
  EDUCATION_LEVELS,
  UNIVERSITY_DEPARTMENTS,
} from "@/constants/student.constants";
import { useState } from "react";
import { authService } from "@/features/auth/service/auth.service";

// ─── Shared styles (unchanged) ────────────────────────────────────────────────

const inputCls = `
  w-full rounded-xl border border-white/[0.08] bg-white/[0.03]
  px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20
  focus:border-[#639922]/40 focus:outline-none focus:ring-2 focus:ring-[#639922]/10
  transition-all duration-200
`;
const errCls = "border-red-500/40 focus:border-red-500/50";

// ─── Helper components (unchanged) ────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/25 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </p>
  );
}

function ComboField({
  value,
  placeholder,
  open,
  onOpenChange,
  error,
  children,
}: {
  value: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            inputCls,
            "flex items-center justify-between text-left",
            error && errCls,
            !value && "text-white/20"
          )}
        >
          <span className={value ? "text-white/80" : "text-white/20"}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-white/25 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-white/[0.09] bg-[#131518] shadow-xl">
        {children}
      </PopoverContent>
    </Popover>
  );
}

const commandCls = `
  [&_[cmdk-group-heading]]:text-[10px]
  [&_[cmdk-group-heading]]:font-semibold
  [&_[cmdk-group-heading]]:uppercase
  [&_[cmdk-group-heading]]:tracking-widest
  [&_[cmdk-group-heading]]:text-white/20
  [&_[cmdk-group-heading]]:px-3
  [&_[cmdk-group-heading]]:py-2
`;

// ─── Main component ───────────────────────────────────────────────────────────

interface StepAcademicProps {
  status: "studying" | "graduated" | "self_taught";
  control: any;
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  universities: { id: string; name: string }[];
  availableDepartments: string[];
  selectedUniversity: string;
  uniSearchOpen: boolean;
  setUniSearchOpen: (v: boolean) => void;
  deptSearchOpen: boolean;
  setDeptSearchOpen: (v: boolean) => void;
  specialityOpen: boolean;
  setSpecialityOpen: (v: boolean) => void;
}

export function StepAcademic({
  status,
  control,
  register,
  errors,
  watch,
  setValue,
  universities,
  availableDepartments,
  selectedUniversity,
  uniSearchOpen,
  setUniSearchOpen,
  deptSearchOpen,
  setDeptSearchOpen,
  specialityOpen,
  setSpecialityOpen,
}: StepAcademicProps) {
  const verifiedUniNames = new Set(universities.map((u) => u.name));
  const watchedDept = watch("department");
  const [wilayaSearchOpen, setWilayaSearchOpen] = useState(false);

  // Self‑taught: no academic fields
  if (status === "self_taught") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <Sparkles className="h-7 w-7 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white/80">You're all set!</h2>
          <p className="text-[13px] text-white/35 mt-1 max-w-xs">
            As a self‑taught learner, you don't need academic details. Just hit{" "}
            <strong className="text-white/60">Continue</strong> to create your
            account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white/85">
          Academic information
        </h2>
        <p className="text-[13px] text-white/35 mt-1">
          {status === "studying"
            ? "Your current university details"
            : "Your graduation details"}
        </p>
      </div>

      {/* University (searchable combobox) – unchanged */}
      <div>
        <FieldLabel required>University / Institution</FieldLabel>
        <ComboField
          value={selectedUniversity}
          placeholder="Search or select university…"
          open={uniSearchOpen}
          onOpenChange={setUniSearchOpen}
          error={!!errors.university}
        >
          <Command className={commandCls}>
            <div className="border-b border-white/[0.07]">
              <CommandInput
                placeholder="Search university…"
                className="border-0 bg-transparent text-[13px] text-white/70 placeholder:text-white/25 h-10"
              />
            </div>
            <CommandList className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <CommandEmpty>
                <p className="text-[12px] text-white/30 text-center py-3">
                  No university found
                </p>
              </CommandEmpty>
              <CommandGroup>
                {ALGERIAN_UNIVERSITIES.map((uni) => (
                  <CommandItem
                    key={uni}
                    value={uni}
                    className="text-[13px] text-white/65 data-[selected=true]:bg-[#639922]/10 data-[selected=true]:text-[#639922] rounded-lg mx-1 px-3 py-2 cursor-pointer"
                    onSelect={() => {
                      setValue("university", uni, { shouldValidate: true });
                      setUniSearchOpen(false);
                    }}
                  >
                    <span className="flex-1">{uni}</span>
                    {selectedUniversity === uni && (
                      <Check className="h-3.5 w-3.5 text-[#639922] shrink-0" />
                    )}
                    {verifiedUniNames.has(uni) &&
                      selectedUniversity !== uni && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboField>
        <FieldError message={errors.university?.message} />
      </div>

      {/* Department (searchable combobox) – unchanged */}
      <div>
        <FieldLabel required>Department / Faculty</FieldLabel>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <ComboField
              value={field.value}
              placeholder="Select department…"
              open={deptSearchOpen}
              onOpenChange={setDeptSearchOpen}
              error={!!errors.department}
            >
              <Command className={commandCls}>
                <div className="border-b border-white/[0.07]">
                  <CommandInput
                    placeholder="Search department…"
                    className="border-0 bg-transparent text-[13px] text-white/70 placeholder:text-white/25 h-10"
                  />
                </div>
                <CommandList className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                  <CommandEmpty>
                    <p className="text-[12px] text-white/30 text-center py-3">
                      No department found
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {UNIVERSITY_DEPARTMENTS.map((dept) => {
                      const isRegistered = availableDepartments.includes(dept);
                      return (
                        <CommandItem
                          key={dept}
                          value={dept}
                          className="text-[13px] text-white/65 data-[selected=true]:bg-[#639922]/10 data-[selected=true]:text-[#639922] rounded-lg mx-1 px-3 py-2 cursor-pointer"
                          onSelect={() => {
                            field.onChange(dept);
                            setDeptSearchOpen(false);
                          }}
                        >
                          <span className="flex-1">{dept}</span>
                          {field.value === dept && (
                            <Check className="h-3.5 w-3.5 text-[#639922] shrink-0" />
                          )}
                          {isRegistered && field.value !== dept && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </ComboField>
          )}
        />
        <FieldError message={errors.department?.message} />
        {watchedDept && (
          <p className="text-[11px] mt-1.5 flex items-center gap-1.5">
            {availableDepartments.includes(watchedDept) ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Department is registered —
                connection will proceed automatically
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Department not yet registered —
                connection will be pending
              </span>
            )}
          </p>
        )}
      </div>

      {/* Studying-specific fields */}
      {status === "studying" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Student ID */}
            <div>
              <FieldLabel required>Student ID</FieldLabel>

              <Input
                {...register("studentId", {
                  required: "Student ID is required",

                  validate: async (value) => {
                    if (!value?.trim()) {
                      return "Student ID is required";
                    }

                    if (value.trim().length < 5) {
                      return "Student ID is too short";
                    }

                    const exists = await authService.checkStudentIdExists(
                      value
                    );

                    if (exists) {
                      return "This student ID already exists";
                    }

                    return true;
                  },
                })}
                placeholder="e.g., 202301234"
                className={cn(inputCls, errors.studentId && errCls)}
              />

              <FieldError message={errors.studentId?.message} />
            </div>

            {/* Degree Level */}
            <div>
              <FieldLabel required>Education Level</FieldLabel>

              <Controller
                name="degreeLevel"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(inputCls, errors.degreeLevel && errCls)}
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#131518] border-white/[0.09]">
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value}
                          className="text-[13px] text-white/65 focus:bg-[#639922]/10 focus:text-[#639922]"
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <FieldError message={errors.degreeLevel?.message} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Expected Graduation Year</FieldLabel>
              <Input
                placeholder="2025"
                {...register("graduationYear")}
                className={cn(inputCls, errors.graduationYear && errCls)}
              />
              <FieldError message={errors.graduationYear?.message} />
            </div>
            <div>
              <FieldLabel>Wilaya (State)</FieldLabel>
              <Controller
                name="wilaya"
                control={control}
                render={({ field }) => (
                  <ComboField
                    value={field.value}
                    placeholder="Search or select wilaya…"
                    open={wilayaSearchOpen}
                    onOpenChange={setWilayaSearchOpen}
                    error={!!errors.wilaya}
                  >
                    <Command className={commandCls}>
                      <div className="border-b border-white/[0.07]">
                        <CommandInput
                          placeholder="Search wilaya…"
                          className="border-0 bg-transparent text-[13px] text-white/70 placeholder:text-white/25 h-10"
                        />
                      </div>
                      <CommandList className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        <CommandEmpty>
                          <p className="text-[12px] text-white/30 text-center py-3">
                            No wilaya found
                          </p>
                        </CommandEmpty>
                        <CommandGroup>
                          {ALGERIAN_WILAYAS.map((wil) => (
                            <CommandItem
                              key={wil}
                              value={wil}
                              className="text-[13px] text-white/65 data-[selected=true]:bg-[#639922]/10 data-[selected=true]:text-[#639922] rounded-lg mx-1 px-3 py-2 cursor-pointer"
                              onSelect={() => {
                                field.onChange(wil);
                                setWilayaSearchOpen(false);
                              }}
                            >
                              <span className="flex-1">{wil}</span>
                              {field.value === wil && (
                                <Check className="h-3.5 w-3.5 text-[#639922] shrink-0" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </ComboField>
                )}
              />
              <FieldError message={errors.wilaya?.message} />
            </div>
          </div>
        </>
      )}

      {/* Graduated-specific fields – unchanged */}
      {status === "graduated" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Degree</FieldLabel>
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className={cn(inputCls, errors.degree && errCls)}
                  >
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131518] border-white/[0.09] max-h-52">
                    {COMMON_DEGREES.map((degree) => (
                      <SelectItem
                        key={degree}
                        value={degree}
                        className="text-[13px] text-white/65 focus:bg-[#639922]/10 focus:text-[#639922]"
                      >
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.degree?.message} />
          </div>
          <div>
            <FieldLabel required>Graduation Year</FieldLabel>
            <Input
              placeholder="2023"
              {...register("graduationYear")}
              className={cn(inputCls, errors.graduationYear && errCls)}
            />
            <FieldError message={errors.graduationYear?.message} />
          </div>
        </div>
      )}

      {/* Speciality / Major – unchanged */}
      <div>
        <FieldLabel required>Speciality / Major</FieldLabel>
        <Controller
          name="speciality"
          control={control}
          render={({ field }) => (
            <ComboField
              value={field.value}
              placeholder="Search or select your speciality…"
              open={specialityOpen}
              onOpenChange={setSpecialityOpen}
              error={!!errors.speciality}
            >
              <Command className={commandCls}>
                <div className="border-b border-white/[0.07]">
                  <CommandInput
                    placeholder="Search speciality…"
                    className="border-0 bg-transparent text-[13px] text-white/70 placeholder:text-white/25 h-10"
                  />
                </div>
                <CommandList className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                  <CommandEmpty>
                    <p className="text-[12px] text-white/30 text-center py-3">
                      No speciality found
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {COMMON_SPECIALITIES.map((spec) => (
                      <CommandItem
                        key={spec}
                        value={spec}
                        className="text-[13px] text-white/65 data-[selected=true]:bg-[#639922]/10 data-[selected=true]:text-[#639922] rounded-lg mx-1 px-3 py-2 cursor-pointer"
                        onSelect={() => {
                          field.onChange(spec);
                          setSpecialityOpen(false);
                        }}
                      >
                        <span className="flex-1">{spec}</span>
                        {field.value === spec && (
                          <Check className="h-3.5 w-3.5 text-[#639922] shrink-0" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </ComboField>
          )}
        />
        <FieldError message={errors.speciality?.message} />
      </div>
    </div>
  );
}
