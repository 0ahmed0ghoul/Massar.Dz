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
import { CompanyFormData } from "../../service/auth.service";


interface CompanyFormProps {
  data: CompanyFormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof CompanyFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CompanyForm({
  data,
  isLoading,
  onChange,
  onSelectChange,
  onSubmit,
}: CompanyFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Company name */}
      <div className="space-y-2">
        <Label
          htmlFor="companyName"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          Company name
        </Label>
        <Input
          id="companyName"
          placeholder="Acme Inc."
          value={data.companyName}
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
            Your first name
          </Label>
          <Input
            id="firstName"
            placeholder="John"
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
            Your last name
          </Label>
          <Input
            id="lastName"
            placeholder="Smith"
            value={data.lastName}
            onChange={onChange}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30
                       focus:border-white/20 focus:ring-white/10"
          />
        </div>
      </div>

      {/* Work email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-white/60 text-xs font-medium uppercase tracking-wider"
        >
          Work email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@acme.com"
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

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">
          Industry
        </Label>
        <Select
          value={data.industry}
          onValueChange={(v) => onSelectChange("industry", v)}
        >
          <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-white/10">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0b0c0e] text-white">
            {[
              ["technology", "Technology"],
              ["finance", "Finance"],
              ["healthcare", "Healthcare"],
              ["education", "Education"],
              ["other", "Other"],
            ].map(([v, label]) => (
              <SelectItem
                key={v}
                value={v}
                className="focus:bg-white/10 focus:text-white"
              >
                {label}
              </SelectItem>
            ))}
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
