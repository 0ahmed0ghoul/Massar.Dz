// features/student/hooks/useStudentExperiences.ts

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  experienceService,
} from "../services/experience.service";
import { Application } from "@/types/student";
import {
  applicationService,
  calculateMatchScore,
} from "@/features/company/service/application.service";
import { studentService } from "../services/student.service";
import { StudentSkill, studentSkillsService } from "@/features/student/services/studentSkills.service";
import { Experience, ExperienceInput } from "@/types/experience";

// Helper functions to check plan status
const hasActivePlan = (profile: any): boolean => {
  if (!profile) return false;
  return profile.plan_status === "active";
};

const isPremiumUser = (profile: any): boolean => {
  if (!profile) return false;
  return profile.plan_type === "premium" && profile.plan_status === "active";
};

const isBasicUser = (profile: any): boolean => {
  if (!profile) return false;
  return profile.plan_type === "basic" && profile.plan_status === "active";
};

const canAccessPremiumFeatures = (profile: any): boolean => {
  if (!profile) return false;
  return (profile.plan_type === "premium" && profile.plan_status === "active") ||
         (profile.plan_type === "basic" && profile.plan_status === "active");
};

export function useStudentExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  
  const { toast } = useToast();
  const [applications, setApplications] = useState<
    (Application & { interview?: any })[]
  >([]);
  
  // Updated plan tracking
  const [planType, setPlanType] = useState<"free" | "basic" | "premium">("free");
  const [planStatus, setPlanStatus] = useState<"inactive" | "pending" | "active" | "rejected" | "expired">("inactive");
  const [monthlyApplicationsCount, setMonthlyApplicationsCount] = useState(0);

  // Computed properties
  const isActive = planStatus === "active";
  const isPremium = planType === "premium" && planStatus === "active";
  const isBasic = planType === "basic" && planStatus === "active";
  const canAccessPremium = isPremium || isBasic;
  const hasPendingPlan = planStatus === "pending";

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [exp, apps, profile, monthlyCount, skillsData, jobs] = await Promise.all([
        experienceService.getExperiences(user.id),
        applicationService.getStudentApplicationsWithInterviews(user.id),
        studentService.getProfile(user.id),
        applicationService.getMonthlyApplicationsCount(user.id),
        studentSkillsService.getStudentSkills(user.id),
        experienceService.getAllExperiences(),
      ]);
      
      console.log("Loaded profile plan info:", {
        plan_type: profile.plan_type,
        plan_status: profile.plan_status,
      });
      
      // Update plan tracking
      setPlanType(profile.plan_type || "free");
      setPlanStatus(profile.plan_status || "inactive");
      
      console.log("Loaded jobs for matching:", jobs);
      const scored = jobs
      .map((job) => {
        const score = calculateMatchScore(profile, job);
    
        return {
          ...job,
          matchScore: score,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

      setRecommendedJobs(scored);
      setExperiences(exp);
      setApplications(apps);
      setMonthlyApplicationsCount(monthlyCount);
      setSkills(skillsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addExperience = async (exp: ExperienceInput) => {
    if (!user) return false;
    setAdding(true);
    try {
      const newExp = await experienceService.addExperience(user.id, exp);
      setExperiences((prev) => [newExp, ...prev]);
      toast({ title: "Success", description: "Experience added." });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setAdding(false);
    }
  };

  const updateExperience = async (
    expId: string,
    updates: Partial<Omit<ExperienceInput, "student_id">>
  ) => {
    setUpdating(expId);
    try {
      const updated = await experienceService.updateExperience(expId, updates);
      setExperiences((prev) => prev.map((e) => (e.id === expId ? updated : e)));
      toast({ title: "Success", description: "Experience updated." });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(null);
    }
  };

  const deleteExperience = async (expId: string) => {
    setDeleting(expId);
    try {
      await experienceService.deleteExperience(expId);
      setExperiences((prev) => prev.filter((e) => e.id !== expId));
      toast({ title: "Deleted", description: "Experience removed." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const getJobMatchScore = (jobSkills: string[] = []) => {
    return calculateJobMatch(skills, jobSkills);
  };

  // Check if user can apply for more jobs (based on plan)
  const canApplyForJob = (): boolean => {
    if (!isActive) return false;
    
    // Premium users have unlimited applications
    if (isPremium) return true;
    
    // Basic and free users have limits (e.g., 5 applications per month)
    const maxApplications = isBasic ? 10 : 5;
    return monthlyApplicationsCount < maxApplications;
  };

  const getRemainingApplications = (): number => {
    if (!isActive) return 0;
    if (isPremium) return Infinity;
    
    const maxApplications = isBasic ? 10 : 5;
    return Math.max(0, maxApplications - monthlyApplicationsCount);
  };

  return {
    experiences,
    applications,
    // New plan properties
    planType,
    planStatus,
    isActive,
    isPremium,
    isBasic,
    canAccessPremium,
    hasPendingPlan,
    monthlyApplicationsCount,
    remainingApplications: getRemainingApplications(),
    canApplyForJob: canApplyForJob(),
    // Existing properties
    loading,
    adding,
    updating,
    deleting,
    recommendedJobs,
    skills,
    getJobMatchScore,
    addExperience,
    updateExperience,
    deleteExperience,
    refresh: loadData,
  };
}