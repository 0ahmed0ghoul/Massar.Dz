// features/company/hooks/useCompanyJobs.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {jobService } from '../service/job.service';
import { Job, JobInput } from '@/types/job';

export function useCompanyJobs() {
  const { profile } = useAuth();
  const companyId = profile?.id;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadJobs = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await jobService.getCompanyJobs(companyId);
      setJobs(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [companyId, toast]);

  const createJob = async (job: JobInput) => {
    if (!companyId) return null;
    setCreating(true);
    try {
      const newJob = await jobService.createJob(companyId, job);
      setJobs(prev => [newJob, ...prev]);
      toast({ title: 'Success', description: 'Job posted successfully.' });
      return newJob;
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setCreating(false);
    }
  };

  const updateJob = async (jobId: string, updates: Partial<JobInput>) => {
    setUpdating(jobId);
    try {
      const updated = await jobService.updateJob(jobId, updates);
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
      toast({ title: 'Success', description: 'Job updated.' });
      return updated;
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setUpdating(null);
    }
  };

  const deleteJob = async (jobId: string) => {
    setDeleting(jobId);
    try {
      await jobService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast({ title: 'Deleted', description: 'Job removed.' });
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return {
    jobs,
    loading,
    creating,
    updating,
    deleting,
    createJob,
    updateJob,
    deleteJob,
    refresh: loadJobs,
  };
}