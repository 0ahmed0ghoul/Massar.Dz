import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { UniversityFormData } from "../../service/auth.service";

interface UniversityFormProps {
  data: UniversityFormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UniversityForm({
  data,
  isLoading,
  onChange,
  onSubmit,
}: UniversityFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Approval warning */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-400/80 leading-relaxed">
          University accounts require manual review by our team before activation.
          You'll be notified once approved.
        </p>
      </div>

      {/* University name */}
      <div className="space-y-2">
        <Label
          htmlFor="universityName"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          University name
        </Label>
        <Input
          id="universityName"
          placeholder="MIT"
          value={data.universityName}
          onChange={onChange}
          required
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                     focus:border-white/20 focus:ring-white/10"
        />
      </div>

      {/* Admin name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-white/60 text-xs font-medium uppercase tracking-wider"
          >
            Admin first name
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
            Admin last name
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

      {/* Institutional email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          Institutional email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@university.edu"
          value={data.email}
          onChange={onChange}
          required
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                     focus:border-white/20 focus:ring-white/10"
        />
        {/* Hint about .edu */}
        <p className="text-[11px] text-white/30">
          Use your institution's official email address.
        </p>
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

      {/* City */}
      <div className="space-y-2">
        <Label
          htmlFor="city"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          City
        </Label>
        <Input
          id="city"
          placeholder="Cambridge"
          value={data.city}
          onChange={onChange}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                     focus:border-white/20 focus:ring-white/10"
        />
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
