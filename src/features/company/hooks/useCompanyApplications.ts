// features/company/hooks/useCompanyApplications.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Application, applicationService } from '../service/application.service';

export function useCompanyApplications(jobId: string | null) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const data = await applicationService.getApplicationsForJob(jobId);
      setApplications(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [jobId, toast]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const updateStatus = async (applicationId: string, status: Application['status']) => {
    setUpdating(applicationId);
    try {
      const updated = await applicationService.updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(app => app.id === applicationId ? updated : app));
      toast({ title: 'Success', description: 'Status updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const updateRating = async (applicationId: string, rating: number) => {
    setUpdating(applicationId);
    try {
      const updated = await applicationService.updateApplicationRating(applicationId, rating);
      setApplications(prev => prev.map(app => app.id === applicationId ? updated : app));
      toast({ title: 'Success', description: 'Rating updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const updateNotes = async (applicationId: string, notes: string) => {
    setUpdating(applicationId);
    try {
      const updated = await applicationService.updateApplicationNotes(applicationId, notes);
      setApplications(prev => prev.map(app => app.id === applicationId ? updated : app));
      toast({ title: 'Success', description: 'Notes saved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  return {
    applications,
    loading,
    updating,
    updateStatus,
    updateRating,
    updateNotes,
    refresh: loadApplications,
  };
}