// features/student/hooks/useStudentDashboard.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "../services/student.service";
import { applicationService } from "@/features/company/service/application.service"; // ✅ add this import
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
      // ✅ Use applicationService.getStudentApplications (returns job with company object)
      const [applications, jobs, activities, interviews, profile] = await Promise.all([
        applicationService.getStudentApplications(user.id),
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
        applications, // now each app has `job.title` and `job.company.company_name`
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