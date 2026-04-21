// pages/company/CompanyApplicationsPage.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Users } from "lucide-react";
import { useCompanyData } from "../hooks/useCompanyData";

export default function CompanyApplicationsPage() {
  const { jobs, getApplicationsForJob, updateApplication, addNote, setRating } = useCompanyData();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const applications = selectedJobId ? getApplicationsForJob(selectedJobId) : [];

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

  return (
    <div className="relative min-h-screen bg-background">
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
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Applicant Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/40">Manage applications, shortlist candidates, and add notes.</p>
        </div>

        {/* Job Selector Card */}
        <div className="group mb-6 rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
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

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-8 text-center text-foreground/40 backdrop-blur-md">
            No applications for this job yet.
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30"
              >
                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {app.candidate?.firstName} {app.candidate?.lastName}
                      </h3>
                      <p className="text-xs text-foreground/40">{app.candidate?.email} • {app.candidate?.university}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-600/20 text-blue-400">
                        AI Match: {app.aiMatchScore || "—"}%
                      </Badge>
                      <Select
                        value={app.status}
                        onValueChange={(val) => updateApplication(app.id, { status: val as any })}
                      >
                        <SelectTrigger className="h-7 w-36 border-white/20 bg-white/10 text-xs text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-white/20 bg-[#1a1c20] text-foreground">
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
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
                          onClick={() => setRating(app.id, r)}
                        />
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="mb-1 flex items-center gap-1 text-sm text-foreground/60">
                        <MessageSquare className="h-3 w-3" /> Notes
                      </label>
                      <Textarea
                        value={app.notes}
                        onChange={(e) => addNote(app.id, e.target.value)}
                        className="bg-white/10 border-white/20 text-foreground"
                        rows={3}
                        placeholder="Add interview feedback, strengths, concerns..."
                      />
                    </div>

                    <div className="text-xs text-foreground/40">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
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