// pages/company/CompanyDashboard.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  UserPlus,
  FileText,
  Calendar,
  Loader2,
  Mail,
  BarChart,
  CheckCircle2,
  Crown,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import { useCompanyApplicationsSummary } from "@/features/company/hooks/useCompanyApplicationsSummary";
import { formatDistanceToNow } from "date-fns";

// Helper to get plan display info
const getPlanDisplay = (planType: string, planStatus: string) => {
  const isActive = planStatus === "active";

  if (planStatus === "pending") {
    return {
      label: "Pending Approval",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
      icon: Clock,
      message:
        "Your payment is being reviewed. Features will be activated once approved.",
    };
  }

  if (planStatus === "rejected") {
    return {
      label: "Payment Rejected",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/30",
      icon: AlertCircle,
      message:
        "Your payment was rejected. Please submit a new payment request.",
    };
  }

  if (!isActive) {
    return {
      label: "No Active Plan",
      color: "text-gray-400",
      bg: "bg-gray-400/10",
      border: "border-gray-400/30",
      icon: Shield,
      message: "You need an active plan to use premium features.",
    };
  }

  if (planType === "premium") {
    return {
      label: "Premium",
      color: "text-[#639922]",
      bg: "bg-[#639922]/10",
      border: "border-[#639922]/30",
      icon: Crown,
      message: "All premium features are available.",
    };
  }

  return {
    label: "Basic",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: Shield,
    message: "Basic features available. Upgrade to Premium for more.",
  };
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  isAvailable,
  isLocked,
  onUpgrade,
  planStatus,
}: any) {
  return (
    <div
      className={`group rounded-xl border p-4 transition ${
        isAvailable
          ? "border-[#639922]/30 bg-[#639922]/5 hover:bg-[#639922]/10"
          : "border-white/[0.08] bg-white/[0.02] opacity-60 hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-lg p-2 ${
            isAvailable ? "bg-[#639922]/20" : "bg-white/5"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              isAvailable ? "text-[#639922]" : "text-white/40"
            }`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-foreground/50">{description}</p>
          {!isAvailable && planStatus === "pending" && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-amber-400/10 px-3 py-1 text-xs text-amber-400">
              <Clock className="h-3 w-3" /> Pending Approval
            </div>
          )}
          {!isAvailable && planStatus === "rejected" && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-red-400/10 px-3 py-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" /> Payment Rejected
            </div>
          )}
          {!isAvailable && planStatus === "inactive" && (
            <button
              onClick={onUpgrade}
              className="mt-3 rounded-md border border-[#639922]/30 bg-[#639922]/10 px-3 py-1 text-xs font-medium text-[#639922] transition hover:bg-[#639922]/20"
            >
              Upgrade
            </button>
          )}
          {isAvailable && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/5 px-3 py-1 text-xs text-white/50">
              <CheckCircle2 className="h-3 w-3 text-[#639922]" /> Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { jobs, loading: jobsLoading } = useCompanyJobs();
  const {
    applications,
    totalCount,
    loading: appsLoading,
  } = useCompanyApplicationsSummary(5);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isExpiredCompanyPlan =
  profile?.role === "company_admin" &&
  (profile?.plan_type === "basic" || profile?.plan_type === "premium") &&
  profile?.plan_status === "expired";
    console.log(profile);
    console.log(isExpiredCompanyPlan);
  // Get plan information
  const planType = profile?.plan_type || "free";
  const planStatus = profile?.plan_status || "inactive";
  const isActive = planStatus === "active";
  const isPremium = planType === "premium" && isActive;
  const isBasic = planType === "basic" && isActive;
  const isPending = planStatus === "pending";
  const isRejected = planStatus === "rejected";
  const hasActivePlan = isActive && (isPremium || isBasic);

  const planDisplay = getPlanDisplay(planType, planStatus);
  const PlanIcon = planDisplay.icon;

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
      case "shortlisted":
        return "bg-green-600";
      case "interview":
        return "bg-blue-600";
      case "rejected":
        return "bg-red-600";
      case "hired":
        return "bg-purple-600";
      default:
        return "bg-yellow-600";
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-300 ${
            isExpiredCompanyPlan
              ? "pointer-events-none select-none blur-md opacity-40"
              : ""
          }`}
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Company Dashboard
              </h1>
              <p className="mt-1 text-sm text-foreground/40">
                Manage your jobs, candidates, and recruitment pipeline.
              </p>
            </div>
            <Link to="/dashboard/company/jobs">
              <Button className="bg-[#639922] text-foreground hover:bg-[#4f7a1a]">
                <Briefcase className="mr-2 h-4 w-4" /> Post a Job
              </Button>
            </Link>
          </div>

          {/* Plan Status Banner */}
          <div
            className={`mb-8 rounded-2xl border ${planDisplay.border} ${planDisplay.bg} p-4 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${planDisplay.bg}`}
                >
                  <PlanIcon className={`h-5 w-5 ${planDisplay.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${planDisplay.color}`}>
                      {planDisplay.label} Plan
                    </p>
                    {isPremium && (
                      <Badge className="bg-[#639922]/20 text-[#639922] border-[#639922]/30">
                        <Crown className="h-3 w-3 mr-1" /> Full Access
                      </Badge>
                    )}
                    {isBasic && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <Shield className="h-3 w-3 mr-1" /> Limited Access
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {planDisplay.message}
                  </p>
                </div>
              </div>
              {!hasActivePlan &&
                planStatus !== "pending" &&
                planStatus !== "rejected" && (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="rounded-lg bg-[#639922] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#4f7a1a]"
                  >
                    Choose a Plan
                  </button>
                )}
              {isPending && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-400/20 px-4 py-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-amber-400">
                    Awaiting approval
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-[#639922]/30"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium uppercase tracking-wider text-foreground/50">
                    {s.label}
                  </p>
                  <s.icon className="h-4 w-4 text-foreground/40 transition-colors group-hover:text-[#639922]" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-foreground">
                    {s.value}
                  </div>
                  <p className="text-xs text-foreground/40">{s.desc}</p>
                  <p className="mt-1 text-[11px] font-medium text-[#639922]">
                    {s.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Features – Premium */}
          <div className="mb-8 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-foreground">
                Smart Features
              </h2>
              {!hasActivePlan && !isPending && !isRejected && (
                <span className="ml-auto text-[10px] font-medium text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              )}
              {isPending && (
                <span className="ml-auto text-[10px] font-medium text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  Pending Approval
                </span>
              )}
              {isBasic && (
                <span className="ml-auto text-[10px] font-medium text-blue-400/80 bg-blue-400/10 px-2 py-0.5 rounded-full">
                  Basic Plan
                </span>
              )}
              {isPremium && (
                <span className="ml-auto text-[10px] font-medium text-[#639922]/80 bg-[#639922]/10 px-2 py-0.5 rounded-full">
                  Premium Active
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {}
              {/* Smart Ranking - Available only for active plans */}
              <FeatureCard
                icon={TrendingUp}
                title="Smart Ranking"
                description="Rank applicants by AI‑calculated match score based on job requirements."
                isAvailable={isPremium}
                isLocked={!isPremium}
                planStatus={planStatus}
                onUpgrade={() => navigate("/pricing")}
              />

              {/* Bulk Messaging - Premium only */}
              <FeatureCard
                icon={Mail}
                title="Bulk Messaging"
                description="Send interview invites or updates to multiple candidates at once."
                isAvailable={isPremium}
                isLocked={!isPremium}
                planStatus={planStatus}
                onUpgrade={() => navigate("/pricing")}
              />

              {/* Advanced Analytics - Premium only */}
              <FeatureCard
                icon={BarChart}
                title="Advanced Analytics"
                description="Get insights on funnel metrics, time‑to‑hire, and source effectiveness."
                isAvailable={isPremium}
                isLocked={!isPremium}
                planStatus={planStatus}
                onUpgrade={() => navigate("/pricing")}
              />
            </div>
          </div>

          {/* Recent Applications */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#639922]" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Applications
                  </h2>
                </div>
                <Link
                  to="/company/dashboard/applications"
                  className="text-xs text-[#639922] hover:text-[#7ab33e]"
                >
                  View all →
                </Link>
              </div>
              {appsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
                </div>
              ) : applications.length === 0 ? (
                <p className="text-sm text-foreground/40">
                  No applications yet. Once students start applying, they will
                  appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-full border border-white/10">
                            {app.student?.avatar_url ? (
                              <AvatarImage
                                src={app.student.avatar_url}
                                alt={`${app.student?.first_name} ${app.student?.last_name}`}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-xs font-semibold">
                                {getInitials(
                                  `${app.student?.first_name} ${app.student?.last_name}`
                                )}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">
                              {app.student?.first_name} {app.student?.last_name}
                            </p>
                            <p className="text-xs text-foreground/40">
                              Applied for{" "}
                              <span className="text-[#639922]">
                                {app.job?.title}
                              </span>
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(app.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                        <Link
                          to={`/company/dashboard/application?job=${app.job_id}&candidate=${app.student_id}`}
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
      {isExpiredCompanyPlan && (
  <div className="absolute inset-0 z-50 flex items-center justify-center">
    <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-background/95 p-8 text-center shadow-2xl backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">
        Your Plan Has Expired
      </h2>

      <p className="mt-3 text-sm text-foreground/60">
        Your company subscription is no longer active.
        Renew your plan to continue accessing dashboard features,
        applications, and job management tools.
      </p>

      <button
        onClick={() => navigate("/pricing")}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#639922] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#4f7a1a]"
      >
        <Crown className="h-4 w-4" />
        Go to Pricing
      </button>
    </div>
  </div>
)}
    </div>
  );
}
