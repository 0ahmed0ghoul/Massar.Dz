// features/student/hooks/useStudentExperiences.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Experience,
  ExperienceInput,
  experienceService,
} from "../services/experience.service";
import { Application } from "@/types/student";
import { applicationService } from "@/features/company/service/application.service";
import { studentService } from "../services/student.service";
import { StudentSkill, studentSkillsService } from "@/features/student/services/studentSkills.service";
import { calculateJobMatch } from "../services/skillMatching.service";

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
  const [isPremium, setIsPremium] = useState(false);
  const [monthlyApplicationsCount, setMonthlyApplicationsCount] = useState(0);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [exp, apps, profile, monthlyCount,skillsData, jobs] = await Promise.all([
        experienceService.getExperiences(user.id),
        applicationService.getStudentApplicationsWithInterviews(user.id), // new method
        studentService.getProfile(user.id),
        applicationService.getMonthlyApplicationsCount(user.id),
        studentSkillsService.getStudentSkills(user.id),
        experienceService.getAllExperiences(),
      ]);
      console.log("Loaded jobs for matching:", jobs);
      const scored = jobs
        .map((job) => {
          const result = calculateJobMatch(skillsData, job.skills || []);

          return {
            ...job,
            matchScore: result.score,
            matchedSkills: result.matched,
            missingSkills: result.missing,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      setRecommendedJobs(scored);
      setExperiences(exp);
      setApplications(apps);
      setIsPremium(Boolean(profile.is_premium));      
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

  return {
    experiences,
    applications,
    isPremium,
    monthlyApplicationsCount,
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
