// pages/company/CompanyDashboard.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Users, Eye, TrendingUp, Sparkles, ArrowRight, Activity, Award, UserPlus, FileText, Calendar, Loader2 } from "lucide-react";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import { useCompanyApplicationsSummary } from "@/features/company/hooks/useCompanyApplicationsSummary";
import { formatDistanceToNow } from "date-fns";

export default function CompanyDashboard() {
  const { jobs, loading: jobsLoading } = useCompanyJobs();
  const { applications, totalCount, loading: appsLoading } = useCompanyApplicationsSummary(5);

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalJobs = jobs.length;

  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: jobsLoading ? "..." : activeJobs,
      desc: `${totalJobs - activeJobs} drafts`,
      trend: "+2 this month",
    },
    {
      icon: Users,
      label: "Applications",
      value: appsLoading ? "..." : totalCount,
      desc: `${applications.length} recent`,
      trend: "Last 7 days",
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

  if (jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted": return "bg-green-600";
      case "interview": return "bg-blue-600";
      case "rejected": return "bg-red-600";
      case "hired": return "bg-purple-600";
      default: return "bg-yellow-600";
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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

        {/* Smart Features Card (unchanged) */}
        <div className="mb-8 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#639922]" />
            <h2 className="text-lg font-semibold text-foreground">Smart Features</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            Coming Soon
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
              </div>
              <Link to="/company/dashboard/applications" className="text-xs text-[#639922] hover:text-[#7ab33e]">
                View all →
              </Link>
            </div>
            {appsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
              </div>
            ) : applications.length === 0 ? (
              <p className="text-sm text-foreground/40">No applications yet. Once students start applying, they will appear here.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-full border border-white/10">
                          <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-xs font-semibold">
                            {getInitials(`${app.student?.first_name} ${app.student?.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">
                            {app.student?.first_name} {app.student?.last_name}
                          </p>
                          <p className="text-xs text-foreground/40">
                            Applied for <span className="text-[#639922]">{app.job?.title}</span>
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                      </span>
                      <Link
                        to={`/company/dashboard/applications?job=${app.job_id}&candidate=${app.student_id}`}
                        className="text-[#639922] hover:underline"
                      >
                        View application →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}