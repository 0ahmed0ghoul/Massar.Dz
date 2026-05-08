// hooks/useCompanyCompleteProfile.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile.types";

interface DocsState {
  logo: File | null;
  registrationCertificate: File | null;
  taxId: string;
}

export function useCompanyCompleteProfile(user: User | null, profile: Profile | null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    wilaya: profile?.wilaya || "",
    companyName: profile?.company_name || "",
    industry: profile?.industry || "",
    companyDescription: profile?.company_description || "",
    companyType: profile?.company_type,
    email: profile?.email,
  });

  const [docs, setDocs] = useState<DocsState>({
    logo: null,
    registrationCertificate: null,
    taxId: "",
  });

  const [previewUrls, setPreviewUrls] = useState({
    logo: "",
    certificate: "",
  });

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleFileChange = async (field: "logo" | "registrationCertificate", file: File | null) => {
    if (!file) return;
    setDocs((prev) => ({ ...prev, [field]: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [field]: url }));
  };

  const removeFile = (field: "logo" | "registrationCertificate") => {
    setDocs((prev) => ({ ...prev, [field]: null }));
    setPreviewUrls((prev) => ({ ...prev, [field]: "" }));
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateTaxId = (value: string) => {
    setDocs((prev) => ({ ...prev, taxId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Upload company logo if provided
      let logoUrl: string | undefined;
      if (docs.logo) {
        logoUrl = await authService.uploadCompanyLogo(user.id, docs.logo);
      }

      // 2. Prepare additional profile data
      const additionalData = {
        first_name: form.firstName,
        last_name: form.lastName,
        company_name: form.companyName,
        industry: form.industry,
        company_description: form.companyDescription,
        wilaya: form.wilaya,
      };

      // 3. Prepare verification documents (excluding logo, which goes to avatar_url)
      const verificationDocs: any = { tax_id: docs.taxId };
      if (docs.registrationCertificate) {
        verificationDocs.registration_certificate = await fileToBase64(docs.registrationCertificate);
      }

      // 4. Submit to auth service
      await authService.markProfileCompleted(user.id, additionalData, verificationDocs, logoUrl);

      toast({
        title: "Profile submitted",
        description: "Your application is now pending admin approval.",
      });
      navigate("/pending-approval");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    docs,
    previewUrls,
    updateForm,
    updateTaxId,
    handleFileChange,
    removeFile,
    handleSubmit,
  };
}