// features/university/hooks/useUniversityCertificateRequests.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { universityCertificateService, CertificateRequest } from '../services/universityCertificate.service';

export function useUniversityCertificateRequests(universityId: string) {
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    if (!universityId) return;
    setLoading(true);
    try {
      const data = await universityCertificateService.getPendingRequests(universityId);
      setRequests(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [universityId, toast]);

  const approveRequest = async (
    request: CertificateRequest,
    file: File,
    customData?: {
      title?: string;
      issuer?: string;
      issue_date?: string;
      expiry_date?: string;
      credential_id?: string;
    }
  ) => {
    setApproving(true);
    // Optimistically remove from UI immediately
    setRequests(prev => prev.filter(r => r.id !== request.id));
    try {
      const fileUrl = await universityCertificateService.uploadCertificateFile(
        universityId,
        request.student_id,
        request.type,
        file
      );
      await universityCertificateService.approveRequest(request.id, {
        file_url: fileUrl,
        title: customData?.title || '',
        issuer: customData?.issuer || '',
        issue_date: customData?.issue_date || new Date().toISOString().split('T')[0],
        expiry_date: customData?.expiry_date,
        credential_id: customData?.credential_id,
      });
      toast({ title: 'Success', description: 'Certificate approved and issued to student.' });
      // Optional: refresh to confirm consistency
      await loadRequests();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      // Revert optimistic removal by reloading
      await loadRequests();
    } finally {
      setApproving(false);
    }
  };

  const rejectRequest = async (request: CertificateRequest, reason: string) => {
    // Similar optimistic removal
    setRequests(prev => prev.filter(r => r.id !== request.id));
    try {
      await universityCertificateService.rejectRequest(request.id, reason);
      toast({ title: 'Request rejected', description: 'Student will be notified.' });
      await loadRequests();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      await loadRequests();
    }
  };

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    loading,
    approving,
    approveRequest,
    rejectRequest,
    refresh: loadRequests,
  };
}