// pages/company/CompanyJobsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase } from "lucide-react";
import { useCompanyData } from "../hooks/useCompanyData";
import JobFormModal from "../components/JobFormModal";

export default function CompanyJobsPage() {
  const { jobs, updateJob, deleteJob } = useCompanyData();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const activeJobs = jobs.filter(j => j.active);
  const inactiveJobs = jobs.filter(j => !j.active);

  return (
    <div className="relative min-h-screen bg-[#0b0c0e]">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Job Postings</h1>
            <p className="mt-1 text-sm text-white/40">Manage your active and draft job listings.</p>
          </div>
          <Button
            onClick={() => {
              setEditingJob(null);
              setShowModal(true);
            }}
            className="bg-[#639922] text-white hover:bg-[#4f7a1a]"
          >
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </div>

        {/* Active Jobs Card */}
        <div className="group mb-6 rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-white">Active Jobs</h2>
              <span className="ml-auto text-sm text-white/40">{activeJobs.length} active</span>
            </div>
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="text-xs text-white/40">
                      {job.type} • {job.location} • Posted {new Date(job.postedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingJob(job);
                        setShowModal(true);
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateJob(job.id, { active: false })}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <EyeOff className="mr-1 h-3 w-3" /> Deactivate
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteJob(job.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {activeJobs.length === 0 && (
                <p className="py-6 text-center text-sm text-white/40">No active jobs. Create your first job posting!</p>
              )}
            </div>
          </div>
        </div>

        {/* Inactive / Draft Jobs Card */}
        {inactiveJobs.length > 0 && (
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-white/40" />
                <h2 className="text-lg font-semibold text-white">Drafts & Inactive</h2>
                <span className="ml-auto text-sm text-white/40">{inactiveJobs.length} total</span>
              </div>
              <div className="space-y-3">
                {inactiveJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 opacity-70 transition-all hover:opacity-100 hover:border-[#639922]/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-white">{job.title}</p>
                      <p className="text-xs text-white/40">{job.type} • Draft</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateJob(job.id, { active: true })}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="mr-1 h-3 w-3" /> Activate
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteJob(job.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <JobFormModal open={showModal} onOpenChange={setShowModal} editingJob={editingJob} />
    </div>
  );
}