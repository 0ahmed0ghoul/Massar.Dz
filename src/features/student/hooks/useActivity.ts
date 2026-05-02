// hooks/useActivity.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Activity, ActivityType } from "../types/activity.types";
import { activityService } from "../services/activity.service";


export function useActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await activityService.getStudentActivities(user.id);
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [user]);

  const addActivity = async (
    type: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    try {
      const newActivity = await activityService.addActivity(user.id, type, title, description, metadata);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  return {
    activities,
    loading,
    addActivity,
    refresh: loadActivities,
  };
}