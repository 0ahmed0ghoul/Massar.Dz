// features/student/hooks/useStudentSkills.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { studentSkillsService, StudentSkill, Skill } from '../../university/services/studentSkills.service';

export function useStudentSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [studentSkills, masterSkills] = await Promise.all([
        studentSkillsService.getStudentSkills(user.id),
        studentSkillsService.getAllSkills(),
      ]);
      setSkills(studentSkills);
      setAllSkills(masterSkills);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const addSkill = async (skillId: string, proficiency: string, yearsOfExperience: number) => {
    if (!user) return false;
    setAdding(true);
    try {
      const newSkill = await studentSkillsService.addSkill(user.id, skillId, proficiency, yearsOfExperience);
      setSkills(prev => [newSkill, ...prev]);
      toast({ title: 'Success', description: 'Skill added.' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setAdding(false);
    }
  };

  const updateSkill = async (studentSkillId: string, updates: { proficiency?: string; years_of_experience?: number }) => {
    setUpdating(studentSkillId);
    try {
      const updated = await studentSkillsService.updateSkill(studentSkillId, updates);
      setSkills(prev => prev.map(s => s.id === studentSkillId ? updated : s));
      toast({ title: 'Updated', description: 'Skill updated.' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setUpdating(null);
    }
  };

  const deleteSkill = async (studentSkillId: string) => {
    setDeleting(studentSkillId);
    try {
      await studentSkillsService.deleteSkill(studentSkillId);
      setSkills(prev => prev.filter(s => s.id !== studentSkillId));
      toast({ title: 'Deleted', description: 'Skill removed.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    skills,
    allSkills,
    loading,
    adding,
    updating,
    deleting,
    addSkill,
    updateSkill,
    deleteSkill,
    refresh: loadData,
  };
}