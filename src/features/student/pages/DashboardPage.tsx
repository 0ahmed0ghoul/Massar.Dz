// pages/DashboardPage.tsx
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCards from "../components/dashboard/StatsCards";
import RecentApplications from "../components/dashboard/RecentApplications";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";
import { useStudentDashboard } from "../hooks/useStudentDashboard";

const DashboardPage = () => {
  const { stats, applications, jobs, activities, interviews, profile, loading } = useStudentDashboard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent sm:h-12 sm:w-12" />
      </div>
    );
  }

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