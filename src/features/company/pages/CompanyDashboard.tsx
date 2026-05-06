// pages/company/CompanyDashboard.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Eye, TrendingUp, Sparkles, ArrowRight, Activity, Award, UserPlus, FileText } from "lucide-react";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";

export default function CompanyDashboard() {
  const { jobs, loading } = useCompanyJobs();

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalJobs = jobs.length;

  // Placeholder stats – replace with real data when available
  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: loading ? "..." : activeJobs,
      desc: `${totalJobs - activeJobs} drafts`,
      trend: "+2 this month",
    },
    {
      icon: Users,
      label: "Applications",
      value: "0",
      desc: "0 new this week",
      trend: "Coming soon",
    },
    {
      icon: Eye,
      label: "Job Views",
      value: "0",
      desc: "Last 30 days",
      trend: "Coming soon",
    },
    {
      icon: TrendingUp,
      label: "Conversion",
      value: "0%",
      desc: "View → apply",
      trend: "Coming soon",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Company Dashboard</h1>
            <p className="mt-1 text-sm text-foreground/40">
              Manage your jobs, candidates, and recruitment pipeline.
            </p>
          </div>
          <Link to="/company/dashboard/jobs">
            <Button className="bg-[#639922] text-foreground hover:bg-[#4f7a1a]">
              <Briefcase className="mr-2 h-4 w-4" /> Post a Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-[#639922]/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-foreground/50">{s.label}</p>
                <s.icon className="h-4 w-4 text-foreground/40 transition-colors group-hover:text-[#639922]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <p className="text-xs text-foreground/40">{s.desc}</p>
                <p className="mt-1 text-[11px] font-medium text-[#639922]">{s.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Features Card */}
        <div className="mb-8 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#639922]" />
            <h2 className="text-lg font-semibold text-foreground">Smart Features</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/pricing">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                <Award className="h-8 w-8 text-[#639922]" />
                <div>
                  <p className="font-medium text-foreground">AI Candidate Matching</p>
                  <p className="text-xs text-foreground/40">Find top matches per job</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-foreground/40" />
              </div>
            </Link>
            <Link to="/pricing">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                <UserPlus className="h-8 w-8 text-[#639922]" />
                <div>
                  <p className="font-medium text-foreground">Search Talent Database</p>
                  <p className="text-xs text-foreground/40">Filter by skills, uni, location</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-foreground/40" />
              </div>
            </Link>
            <Link to="/dashboard/company/profile">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                <FileText className="h-8 w-8 text-[#639922]" />
                <div>
                  <p className="font-medium text-foreground">Company Branding</p>
                  <p className="text-xs text-foreground/40">Get verified & attract talent</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-foreground/40" />
              </div>
            </Link>
            <Link to="dashboard/company/applications">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                <Activity className="h-8 w-8 text-[#639922]" />
                <div>
                  <p className="font-medium text-foreground">Applicant Dashboard</p>
                  <p className="text-xs text-foreground/40">Shortlist, reject, interview</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-foreground/40" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Applications (placeholder) */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
              </div>
              <Link to="/company/applications" className="text-xs text-[#639922] hover:text-[#7ab33e]">
                View all →
              </Link>
            </div>
            <p className="text-sm text-foreground/40">No applications yet. Once students start applying, they will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}