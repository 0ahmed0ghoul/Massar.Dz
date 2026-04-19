// pages/company/CompanyDashboard.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  UserPlus,
  FileText,
  Award,
  ArrowRight,
  Activity,
  Sparkles,
} from "lucide-react";
import { useCompanyData } from "../hooks/useCompanyData";

const CompanyDashboard = () => {
  const { jobs, applications, candidates, getAIMatchedCandidates } = useCompanyData();

  const activeJobs = jobs.filter((j) => j.active).length;
  const totalApps = applications.length;
  const newApps = applications.filter(
    (a) => new Date(a.appliedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const totalCandidates = candidates.length;

  // Mock AI‑suggested top candidate for the first active job
  const firstActiveJob = jobs.find((j) => j.active);
  const topMatches = firstActiveJob ? getAIMatchedCandidates(firstActiveJob.id, 1) : [];
  const topCandidate = topMatches[0];

  // Recent applications (last 3)
  const recentApps = applications.slice(-3).map((app) => {
    const job = jobs.find((j) => j.id === app.jobId);
    const candidate = candidates.find((c) => c.id === app.candidateId);
    return {
      ...app,
      jobTitle: job?.title,
      candidateName: `${candidate?.firstName} ${candidate?.lastName}`,
      candidateInitials: `${candidate?.firstName?.[0]}${candidate?.lastName?.[0]}`,
    };
  });

  // Stats for cards (some mock data)
  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: activeJobs,
      desc: `${jobs.length - activeJobs} drafts`,
      trend: "+2 this month",
    },
    {
      icon: Users,
      label: "Applications",
      value: totalApps,
      desc: `${newApps} new this week`,
      trend: "+12% vs last month",
    },
    {
      icon: Eye,
      label: "Job Views",
      value: "1,240",
      desc: "Last 30 days",
      trend: "+8.2%",
    },
    {
      icon: TrendingUp,
      label: "Conversion",
      value: "3.8%",
      desc: "View → apply",
      trend: "+0.5%",
    },
  ];

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

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Company Dashboard</h1>
            <p className="mt-1 text-sm text-white/40">
              Manage your jobs, candidates, and recruitment pipeline.
            </p>
          </div>
          <Link to="/company/jobs/new">
            <Button className="bg-[#639922] text-white hover:bg-[#4f7a1a]">
              <Briefcase className="mr-2 h-4 w-4" /> Post a Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid – glassmorphic cards with hover effect */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5"
              style={{ animation: `floatStat ${2 + idx * 0.5}s ease-in-out infinite` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-white/50">
                  {s.label}
                </p>
                <s.icon className="h-4 w-4 text-white/40 transition-colors group-hover:text-[#639922]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <p className="text-xs text-white/40">{s.desc}</p>
                <p className="mt-1 text-[11px] font-medium text-[#639922]">{s.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout for smart features + AI match */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Left: Smart Features card */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-[#639922]/30 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-white">Smart Features</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/company/talent/ai-match">
                <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                  <Award className="h-8 w-8 text-[#639922]" />
                  <div>
                    <p className="font-medium text-white">AI Candidate Matching</p>
                    <p className="text-xs text-white/40">Find top 10 matches per job</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/40" />
                </div>
              </Link>
              <Link to="/company/talent">
                <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                  <UserPlus className="h-8 w-8 text-[#639922]" />
                  <div>
                    <p className="font-medium text-white">Search Talent Database</p>
                    <p className="text-xs text-white/40">Filter by skills, uni, location</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/40" />
                </div>
              </Link>
              <Link to="/company/profile">
                <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                  <FileText className="h-8 w-8 text-[#639922]" />
                  <div>
                    <p className="font-medium text-white">Company Branding</p>
                    <p className="text-xs text-white/40">Get verified & attract talent</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/40" />
                </div>
              </Link>
              <Link to="/company/applications">
                <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 hover:bg-white/[0.05]">
                  <Activity className="h-8 w-8 text-[#639922]" />
                  <div>
                    <p className="font-medium text-white">Applicant Dashboard</p>
                    <p className="text-xs text-white/40">Shortlist, reject, interview</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/40" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right: AI Top Match card (floating effect) */}
          {topCandidate && (
            <div
              className="rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#639922]/10 to-transparent p-5 backdrop-blur-md transition-all hover:border-[#639922]/30"
              style={{ animation: "floatCard 4s ease-in-out infinite" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-white/40">
                  AI top match for {firstActiveJob?.title}
                </span>
                <span className="rounded-full bg-[#639922]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#639922]">
                  {topCandidate.aiScore}% match
                </span>
              </div>
              <p className="text-base font-bold text-white">
                {topCandidate.firstName} {topCandidate.lastName}
              </p>
              <p className="mb-2 text-xs text-white/50">
                {topCandidate.university} · {topCandidate.experience}
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {topCandidate.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/55"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-[#639922]"
                    style={{ width: `${topCandidate.aiScore}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#639922]">{topCandidate.aiScore}%</span>
              </div>
              <Link to={`/company/applications?candidate=${topCandidate.id}`}>
                <Button
                  variant="link"
                  className="mt-3 h-auto p-0 text-xs text-[#639922] hover:text-[#7ab33e]"
                >
                  View profile →
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications Card */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
              </div>
              <Link
                to="/company/applications"
                className="text-xs text-[#639922] transition hover:text-[#7ab33e]"
              >
                View all →
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <p className="text-sm text-white/40">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-[#639922]/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#639922] to-[#3B6D11] text-xs font-bold text-white">
                        {app.candidateInitials}
                      </div>
                      <div>
                        <p className="font-medium text-white">{app.candidateName}</p>
                        <p className="text-xs text-white/40">Applied for {app.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-white/40">AI Match: {app.aiMatchScore || '—'}%</span>
                      <Badge
                        className={
                          app.status === "shortlisted"
                            ? "bg-green-600"
                            : app.status === "interview"
                            ? "bg-blue-600"
                            : app.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating animations */}
      <style>{`
        @keyframes floatStat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default CompanyDashboard;