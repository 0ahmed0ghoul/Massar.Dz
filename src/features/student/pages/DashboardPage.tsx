// pages/DashboardPage.tsx
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCards from "../components/dashboard/StatsCards";
import RecentApplications from "../components/dashboard/RecentApplications";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";
import { useStudentDashboard } from "../hooks/useStudentDashboard";
import { useStudentQA } from "../hooks/useStudentQA";
import { Link } from "react-router-dom";
import { FileQuestion, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  const { stats, applications, jobs, activities, interviews, profile, loading } = useStudentDashboard();
  const { pendingCount, completed, loading: qaLoading } = useStudentQA();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent sm:h-12 sm:w-12" />
      </div>
    );
  }

  // Check if we should show the questionnaire banner
  const shouldShowQuestionnaire = !qaLoading && !completed && profile?.candidate_type=='graduated' && !profile.is_questioned;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Textures */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#639922]/[0.05] blur-[120px]" />

      {/* Main container with safe padding */}
      <div className="relative z-10 mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        <div className="space-y-5 sm:space-y-6 md:space-y-8">
          {/* Welcome Header */}
          <header className="flex flex-col gap-1 sm:gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                Welcome back,{" "}
                <span className="text-[#639922]">{profile?.first_name}</span>
              </h1>
              <p className="text-xs text-foreground/40 sm:text-sm md:text-base">
                Here's what's happening with your career path today.
              </p>
            </div>
          </header>

          {/* Pending Questions Banner - Shows when is_questioned is false */}
          {shouldShowQuestionnaire && (
            <Card className="border-[#639922]/30 bg-gradient-to-r from-[#639922]/5 to-[#639922]/10 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between flex-wrap gap-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#639922]/20 shrink-0">
                      <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-[#639922]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        Complete Your Profile Questionnaire
                      </p>
                      <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                        {pendingCount > 0 
                          ? `You have ${pendingCount} unanswered question${pendingCount !== 1 ? "s" : ""}. Help us personalize your experience.`
                          : "Please take a moment to answer a few questions to help us serve you better."
                        }
                      </p>
                    </div>
                  </div>
                  <Link to="/student/dashboard/qa" className="shrink-0">
                    <Button
                      size="sm"
                      className="bg-[#639922] text-white hover:bg-[#4f7a1a] shadow-lg shadow-[#639922]/20 transition-all hover:shadow-xl hover:shadow-[#639922]/30 font-medium"
                    >
                      {pendingCount > 0 ? "Answer Now" : "Get Started"}
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Questionnaire Badge - Shows when all questions are answered */}
          {!qaLoading && completed && profile?.is_questioned && (
            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="h-4 w-4 text-[#639922]" />
              <p className="text-xs sm:text-sm text-foreground/50">
                Profile questionnaire completed
              </p>
            </div>
          )}

          {/* Profile Header */}
          {profile && <ProfileHeader profile={profile} />}

          {/* Stats Cards – ensure it uses its own responsive grid */}
          <div className="-mx-1 sm:mx-0">
            <StatsCards stats={stats} />
          </div>

          {/* Main grid – stacks on mobile, side-by-side on lg */}
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-5 sm:space-y-6 lg:col-span-7">
              <RecentApplications applications={applications} />
              <ActivityTimeline activities={activities} />
            </div>

            {/* Right column */}
            <div className="space-y-5 sm:space-y-6 lg:col-span-5">
              <RecommendedJobs jobs={jobs} />
              <UpcomingInterviews interviews={interviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;