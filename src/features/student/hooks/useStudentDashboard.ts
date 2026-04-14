import { useEffect, useState } from "react";
import { studentService } from "../services/student.service";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/types/database";

type Application = Tables<"applications">;
type Job = Tables<"jobs">;
type Activity = Tables<"activities">;
type Interview = Tables<"interviews">;

interface DashboardState {
  stats: { label: string; value: number }[];
  applications: Application[];
  jobs: Job[];
  activities: Activity[];
  interviews: Interview[];
}

export const useStudentDashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState<DashboardState>({
    stats: [],
    applications: [],
    jobs: [],
    activities: [],
    interviews: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const [applications, jobs, activities, interviews] =
        await Promise.all([
          studentService.getApplications(user.id),
          studentService.getJobs(),
          studentService.getActivities(user.id),
          studentService.getInterviews(user.id),
        ]);

      const stats = [
        { label: "Applications", value: applications.length },
        { label: "Jobs", value: jobs.length },
        { label: "Interviews", value: interviews.length },
        { label: "Activity", value: activities.length },
      ];

      setData({
        stats,
        applications,
        jobs,
        activities,
        interviews,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return { ...data, loading, refetch: fetchDashboard };
};