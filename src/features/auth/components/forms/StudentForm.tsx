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
import { ArrowRight, Loader2 } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { StudentFormData } from "../../service/auth.service";


interface StudentFormProps {
  data: StudentFormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof StudentFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function StudentForm({
  data,
  isLoading,
  onChange,
  onSelectChange,
  onSubmit,
}: StudentFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-white/60 text-xs font-medium uppercase tracking-wider"
          >
            First name
          </Label>
          <Input
            id="firstName"
            placeholder="Jane"
            value={data.firstName}
            onChange={onChange}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                       focus:border-white/20 focus:ring-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-white/60 text-xs font-medium uppercase tracking-wider"
          >
            Last name
          </Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={data.lastName}
            onChange={onChange}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                       focus:border-white/20 focus:ring-white/10"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={onChange}
          required
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                     focus:border-white/20 focus:ring-white/10"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          Password
        </Label>
        <PasswordInput
          id="password"
          value={data.password}
          onChange={onChange}
          required
        />
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
          Degree level
        </Label>
        <Select
          value={data.degreeLevel}
          onValueChange={(v) => onSelectChange("degreeLevel", v)}
        >
          <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-white/10">
            <SelectValue placeholder="Select degree" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0b0c0e] text-white">
            <SelectItem value="bachelor" className="focus:bg-white/10 focus:text-white">
              Bachelor's
            </SelectItem>
            <SelectItem value="master" className="focus:bg-white/10 focus:text-white">
              Master's
            </SelectItem>
            <SelectItem value="phd" className="focus:bg-white/10 focus:text-white">
              PhD
            </SelectItem>
            <SelectItem value="bootcamp" className="focus:bg-white/10 focus:text-white">
              Bootcamp
            </SelectItem>
          </SelectContent>
        </Select>
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
