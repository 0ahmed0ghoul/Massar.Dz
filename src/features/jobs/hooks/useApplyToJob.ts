// features/jobs/hooks/useApplyToJob.ts
import { useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { applicationService } from '@/features/company/service/application.service';

export function useApplyToJob() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const apply = async (jobId: string, coverLetter?: string, cvFile?: File) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to apply.', variant: 'destructive' });
      return false;
    }
    setLoading(true);
    try {
      await applicationService.applyToJob(user.id, jobId, coverLetter, cvFile);
      toast({ title: 'Success', description: 'Application submitted successfully!' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCV = async () => {
    if (!user) return null;
    return await applicationService.getStudentCV(user.id);
  };

  return { apply, getCV, loading };
}