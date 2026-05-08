// features/student/hooks/useStudentDashboard.ts (updated)
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "../services/student.service";
import { DashboardState } from "@/types/student";

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardState>({
    stats: [],
    applications: [],
    jobs: [],
    interviews: [],
    activities: [],
    profile: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [applications, jobs, activities, interviews, profile] = await Promise.all([
        studentService.getApplications(user.id),
        studentService.getJobs(),
        studentService.getActivities(user.id),
        studentService.getInterviews(user.id),
        studentService.getProfile(user.id),
      ]);

      const stats = [
        { label: "Applications", value: applications.length },
        { label: "Upcoming Interviews", value: interviews.length },
        { label: "Activities", value: activities.length },
      ];

      setData({
        stats,
        applications, // now each has `job` with title, company
        jobs,
        interviews,
        activities,
        profile,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return { ...data, loading, error, refetch: fetchDashboard };
};