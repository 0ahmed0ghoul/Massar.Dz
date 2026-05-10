// features/company/service/analytics.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface AnalyticsData {
  daily: { date: string; count: number }[];
  funnel: { stage: string; count: number }[];
}

export async function getApplicationAnalytics(jobId: string): Promise<AnalyticsData> {
  // Fetch all applications for the job
  const { data: applications, error } = await supabase
    .from("applications")
    .select("status, created_at")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!applications.length) return { daily: [], funnel: [] };

  // 1. Daily applications over time
  const dailyMap = new Map<string, number>();
  applications.forEach((app) => {
    const date = new Date(app.created_at).toISOString().split("T")[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });
  const daily = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 2. Funnel counts per status
  const statusOrder = ["pending", "interview", "interview_scheduled", "accepted", "rejected"];
  const funnel = statusOrder.map((stage) => ({
    stage: stage === "accepted" ? "Hired" : stage.replace("_", " "),
    count: applications.filter((a) => a.status === stage).length,
  }));

  return { daily, funnel };
}