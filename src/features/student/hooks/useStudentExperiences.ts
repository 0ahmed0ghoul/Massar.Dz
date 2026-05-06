// features/student/hooks/useStudentExperiences.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Experience, ExperienceInput, experienceService } from '../services/experience.service';
import { Application } from '@/types/student';
import { applicationService } from '@/features/company/service/application.service';


export function useStudentExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [exp, apps] = await Promise.all([
        experienceService.getExperiences(user.id),
        applicationService.getStudentApplications(user.id),
      ]);
      setExperiences(exp);
      setApplications(apps);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
      setExperiences(prev => [newExp, ...prev]);
      toast({ title: 'Success', description: 'Experience added.' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setAdding(false);
    }
  };

  const updateExperience = async (expId: string, updates: Partial<Omit<ExperienceInput, 'student_id'>>) => {
    setUpdating(expId);
    try {
      const updated = await experienceService.updateExperience(expId, updates);
      setExperiences(prev => prev.map(e => e.id === expId ? updated : e));
      toast({ title: 'Success', description: 'Experience updated.' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setUpdating(null);
    }
  };

  const deleteExperience = async (expId: string) => {
    setDeleting(expId);
    try {
      await experienceService.deleteExperience(expId);
      setExperiences(prev => prev.filter(e => e.id !== expId));
      toast({ title: 'Deleted', description: 'Experience removed.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  return {
    experiences,
    applications,
    loading,
    adding,
    updating,
    deleting,
    addExperience,
    updateExperience,
    deleteExperience,
    refresh: loadData,
  };
}