import StatsCards from "../components/dashboard/StatsCards";
import RecentApplications from "../components/dashboard/RecentApplications";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";
import { useStudentDashboard } from "../hooks/useStudentDashboard";

const DashboardPage = () => {
  const {
    stats,
    applications,
    jobs,
    activities,
    interviews,
    loading,
  } = useStudentDashboard();

  if (loading) {
    return <div className="text-white">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentApplications applications={applications} />
        <RecommendedJobs jobs={jobs} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline activities={activities} />
        <UpcomingInterviews interviews={interviews} />
      </div>
    </div>
  );
};

export default DashboardPage;