// components/JobFormModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Calendar, DollarSign, Sparkles, ListChecks, Wrench } from "lucide-react";
import { useCompanyData } from "../hooks/useCompanyData";

export default function JobFormModal({ open, onOpenChange, editingJob }) {
  const { addJob, updateJob } = useCompanyData();
  const [form, setForm] = useState({
    title: "",
    type: "full-time",
    description: "",
    requirements: "",
    skills: "",
    location: "",
    experience: "",
    salary: "",
  });

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title,
        type: editingJob.type,
        description: editingJob.description,
        requirements: editingJob.requirements.join("\n"),
        skills: editingJob.skills.join(", "),
        location: editingJob.location,
        experience: editingJob.experience,
        salary: editingJob.salary || "",
      });
    } else {
      setForm({
        title: "",
        type: "full-time",
        description: "",
        requirements: "",
        skills: "",
        location: "",
        experience: "",
        salary: "",
      });
    }
  }, [editingJob]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title: form.title,
      type: form.type as any,
      description: form.description,
      requirements: form.requirements.split("\n").filter((r) => r.trim()),
      skills: form.skills.split(",").map((s) => s.trim()),
      location: form.location,
      experience: form.experience,
      salary: form.salary || undefined,
      active: true,
    };
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      addJob(jobData);
    }
    onOpenChange(false);
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
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            <div>
              <Label className="text-foreground/80">Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
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
                <Label className="text-foreground/80">Location</Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="border-white/20 bg-white/10 pl-9 text-foreground placeholder:text-foreground/30"
                    placeholder="Algiers, Remote, etc."
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-foreground/80">Experience Required</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="border-white/20 bg-white/10 pl-9 text-foreground placeholder:text-foreground/30"
                    placeholder="e.g., 3+ years"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground/80">Salary (optional)</Label>
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="border-white/20 bg-white/10 pl-9 text-foreground placeholder:text-foreground/30"
                    placeholder="e.g., 60,000 - 80,000 DZD"
                  />
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
              <Label className="text-foreground/80">Skills (comma separated) *</Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                required
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="React, TypeScript, Node.js, etc."
              />
            </div>
            <div>
              <Label className="text-foreground/80">Requirements (one per line)</Label>
              <Textarea
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={4}
                className="mt-1.5 border-white/20 bg-white/10 text-foreground placeholder:text-foreground/30"
                placeholder="Bachelor's degree in Computer Science&#10;3+ years of React experience&#10;Strong communication skills"
              />
            </div>
          </div>

          {/* Form Actions */}
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