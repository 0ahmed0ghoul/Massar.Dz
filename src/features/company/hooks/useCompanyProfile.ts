// features/company/hooks/useCompanyProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CompanyProfile, companyProfileService } from '../service/companyProfile.service';

export function useCompanyProfile() {
  const { user, profile } = useAuth();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await companyProfileService.getCompanyProfile(user.id);
      setCompany(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateProfile = async (updates: Partial<Omit<CompanyProfile, 'id' | 'is_verified'>>) => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await companyProfileService.updateCompanyProfile(user.id, updates);
      setCompany(updated);
      toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user) return null;
    setUploadingLogo(true);
    try {
      const url = await companyProfileService.uploadLogo(user.id, file);
      setCompany(prev => prev ? { ...prev, avatar_url: url } : null);
      toast({ title: 'Success', description: 'Logo uploaded.' });
      return url;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    company,
    loading,
    saving,
    uploadingLogo,
    updateProfile,
    uploadLogo,
  };
}