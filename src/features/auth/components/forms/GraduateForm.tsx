import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, GraduationCap, Award } from "lucide-react";

interface GraduateFormProps {
  isLoading: boolean;
  onSubmit: (data: any) => Promise<void>;
}

export function GraduateForm({ isLoading, onSubmit }: GraduateFormProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    graduationYear: new Date().getFullYear().toString(),
    university: "",
    degree: "",
    speciality: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</Label>
        <Input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="Ahmed Benali" />
      </div>

      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
        <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="ahmed@example.com" />
      </div>

      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
        <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="••••••••" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Graduation Year</Label>
          <Input required value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="2024" />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><GraduationCap className="w-3 h-3" /> University</Label>
          <Input required value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="University of Algiers" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Degree</Label>
          <Input required value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="Bachelor's in CS" />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Major</Label>
          <Input required value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="Computer Science" />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Award className="w-3 h-3" /> Skills (comma separated)</Label>
        <Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="border-white/10 bg-white/5 text-foreground mt-1.5" placeholder="React, Python, Leadership" />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>
    </form>
  );
}