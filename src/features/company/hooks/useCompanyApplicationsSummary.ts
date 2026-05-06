// features/company/hooks/useCompanyApplicationsSummary.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {applicationService } from '../service/application.service';
import { Application } from '@/types/application';

export function useCompanyApplicationsSummary(limit: number = 5) {
  const { profile } = useAuth();
  const companyId = profile?.id;
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSummary = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      // Use the correct method name
      const [recent, total] = await Promise.all([
        applicationService.getApplicationsForCompany(companyId, limit),
        applicationService.getTotalApplicationsCountForCompany(companyId),
      ]);
      setApplications(recent);
      setTotalCount(total);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [companyId, limit, toast]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return { applications, totalCount, loading };
}