// pages/company/CompanyApplicationsPage.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Users, Loader2 } from "lucide-react";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import { useCompanyApplications } from "@/features/company/hooks/useCompanyApplications";

export default function CompanyApplicationsPage() {
  const { jobs, loading: jobsLoading } = useCompanyJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const { applications, loading, updating, updateStatus, updateRating, updateNotes } = useCompanyApplications(selectedJobId || null);

  const statusOptions = ["pending", "reviewing", "shortlisted", "interview", "rejected", "hired"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted": return "bg-green-600";
      case "interview": return "bg-blue-600";
      case "rejected": return "bg-red-600";
      case "hired": return "bg-purple-600";
      default: return "bg-yellow-600";
    }
  };

  if (jobsLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#639922]" /></div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="relative min-h-screen bg-background">
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-8 text-center text-foreground/40 backdrop-blur-md">
            <Users className="mx-auto h-12 w-12 mb-3 opacity-50" />
            No jobs posted yet. Post a job to start receiving applications.
          </div>
        </div>
      </div>
    );
  }

  if (!selectedJobId && jobs.length > 0) {
    setSelectedJobId(jobs[0].id);
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Applicant Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/40">Manage applications, shortlist candidates, and add notes.</p>
        </div>

        <div className="group mb-6 rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-foreground">Select Job</h2>
            </div>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="w-full border-white/20 bg-white/10 text-foreground sm:w-64">
                <SelectValue placeholder="Choose a job" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-8 text-center text-foreground/40 backdrop-blur-md">
            No applications for this job yet.
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30"
              >
                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {app.student?.first_name} {app.student?.last_name}
                      </h3>
                      <p className="text-xs text-foreground/40">
                        {app.student?.email} • {app.student?.university_name || 'University not set'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {app.ai_match_score && (
                        <Badge className="bg-blue-600/20 text-blue-400">
                          AI Match: {app.ai_match_score}%
                        </Badge>
                      )}
                      <Select
                        value={app.status}
                        onValueChange={(val) => updateStatus(app.id, val as any)}
                        disabled={updating === app.id}
                      >
                        <SelectTrigger className="h-7 w-36 border-white/20 bg-white/10 text-xs text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Rating stars */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground/60">Rating:</span>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <Star
                          key={r}
                          className={`h-4 w-4 cursor-pointer transition hover:scale-110 ${
                            r <= app.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-foreground/30"
                          }`}
                          onClick={() => updateRating(app.id, r)}
                        />
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="mb-1 flex items-center gap-1 text-sm text-foreground/60">
                        <MessageSquare className="h-3 w-3" /> Notes
                      </label>
                      <Textarea
                        value={app.notes || ""}
                        onChange={(e) => updateNotes(app.id, e.target.value)}
                        className="bg-white/10 border-white/20 text-foreground"
                        rows={3}
                        placeholder="Add interview feedback, strengths, concerns..."
                        disabled={updating === app.id}
                      />
                    </div>

                    <div className="text-xs text-foreground/40">
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}