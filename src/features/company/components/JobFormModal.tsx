// components/JobFormModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkillsInput } from "@/features/auth/components/skills-input";
import { Briefcase, MapPin, Calendar, DollarSign, Sparkles, ListChecks, Wrench } from "lucide-react";
import { JobInput } from "@/types/job";

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob: any | null;
  onSave: (job: JobInput) => Promise<void>;
}

export function JobFormModal({ open, onOpenChange, editingJob, onSave }: JobFormModalProps) {
  const [form, setForm] = useState<JobInput>({
    title: "",
    description: "",
    requirements: "",
    location: "",
    job_type: "full-time",
    experience_level: "entry",
    salary_min: null,
    salary_max: null,
    salary_currency: "DZD",
    skills: [],
    status: "active",
  });

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title,
        description: editingJob.description,
        requirements: editingJob.requirements || "",
        location: editingJob.location || "",
        job_type: editingJob.job_type,
        experience_level: editingJob.experience_level,
        salary_min: editingJob.salary_min,
        salary_max: editingJob.salary_max,
        salary_currency: editingJob.salary_currency,
        skills: editingJob.skills || [],
        status: editingJob.status,
      });
    } else {
      setForm({
        title: "",
        description: "",
        requirements: "",
        location: "",
        job_type: "full-time",
        experience_level: "entry",
        salary_min: null,
        salary_max: null,
        salary_currency: "DZD",
        skills: [],
        status: "active",
      });
    }
  }, [editingJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    onOpenChange(false);
  };

  const updateField = (field: keyof JobInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-white/10 bg-[#0f1012] text-foreground sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-5 w-5 text-[#639922]" />
            {editingJob ? "Edit Job Posting" : "Post a New Job"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Briefcase className="h-4 w-4 text-[#639922]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                Basic Information
              </h3>
            </div>
            <div>
              <Label className="text-foreground/80">Job Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            <div>
              <Label className="text-foreground/80">Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                required
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <ListChecks className="h-4 w-4 text-[#639922]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                Job Details
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-foreground/80">Job Type</Label>
                <Select value={form.job_type} onValueChange={(v) => updateField("job_type", v)}>
                  <SelectTrigger className="mt-1.5 border-white/20 bg-white/10 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground/80">Experience Level</Label>
                <Select value={form.experience_level} onValueChange={(v) => updateField("experience_level", v)}>
                  <SelectTrigger className="mt-1.5 border-white/20 bg-white/10 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead / Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-foreground/80">Location</Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    value={form.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="border-white/20 bg-white/10 pl-9 text-foreground placeholder:text-foreground/30"
                    placeholder="Algiers, Remote, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-foreground/80">Min Salary</Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <Input
                      type="number"
                      value={form.salary_min ?? ""}
                      onChange={(e) => updateField("salary_min", e.target.value ? Number(e.target.value) : null)}
                      className="border-white/20 bg-white/10 pl-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground/80">Max Salary</Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <Input
                      type="number"
                      value={form.salary_max ?? ""}
                      onChange={(e) => updateField("salary_max", e.target.value ? Number(e.target.value) : null)}
                      className="border-white/20 bg-white/10 pl-9 text-foreground"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Wrench className="h-4 w-4 text-[#639922]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                Skills & Requirements
              </h3>
            </div>
            <div>
              <Label className="text-foreground/80">Skills (press Enter or comma to add)</Label>
              <SkillsInput
                value={form.skills}
                onChange={(skills) => updateField("skills", skills)}
                placeholder="React, TypeScript, Node.js, etc."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-foreground/80">Requirements (optional)</Label>
              <Textarea
                value={form.requirements || ""}
                onChange={(e) => updateField("requirements", e.target.value)}
                rows={4}
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="Bachelor's degree in Computer Science&#10;3+ years of React experience&#10;Strong communication skills"
              />
            </div>
          </div>

          {/* Status (only when editing) */}
          {editingJob && (
            <div>
              <Label className="text-foreground/80">Status</Label>
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger className="mt-1.5 border-white/20 bg-white/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-foreground/80 hover:bg-white/10 hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#639922] text-foreground transition-all hover:bg-[#4f7a1a]"
            >
              {editingJob ? "Update Job" : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}