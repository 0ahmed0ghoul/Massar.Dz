// features/student/hooks/useStudentDashboard.ts
import { useEffect, useState } from "react";
import { studentService } from "../services/student.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Tables } from "@/types/database";

type Application = Tables<"applications">;
type Job = Tables<"jobs">;
type Interview = Tables<"interviews">;
type Activity = Tables<"activities">;
type Profile = Tables<"profiles">; // ✅ Use Tables<"profiles"> instead of @/types/supabase

interface DashboardState {
  stats: { label: string; value: number }[];
  applications: Application[];
  jobs: Job[];
  interviews: Interview[];
  activities: Activity[];
  profile: Profile | null;
}

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
        studentService.getProfile(user.id), // ✅ Now matches Profile type
      ]);

      const stats = [
        { label: "Applications", value: applications.length },
        { label: "Jobs Available", value: jobs.length },
        { label: "Upcoming Interviews", value: interviews.length },
        { label: "Activities", value: activities.length },
      ];

      setData({
        stats,
        applications,
        jobs,
        interviews,
        activities,
        profile, // ✅ No type error
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