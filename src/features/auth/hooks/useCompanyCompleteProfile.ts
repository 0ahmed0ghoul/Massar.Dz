// hooks/useCompanyCompleteProfile.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService, CompanyFormData } from "../service/auth.service";
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

  const [form, setForm] = useState<CompanyFormData>({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    wilaya: profile?.wilaya || profile?.wilaya || "",
    companyName: profile?.company_name || "",
    industry: profile?.industry || "",
    companyDescription: profile?.company_description || "",
    companyType:profile?.company_type,
    email:profile?.email,
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
    console.log(`File uploaded for ${field}:`, file);
    setDocs((prev) => ({ ...prev, [field]: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [field]: url }));
  };

  const removeFile = (field: "logo" | "registrationCertificate") => {
    setDocs((prev) => ({ ...prev, [field]: null }));
    setPreviewUrls((prev) => ({ ...prev, [field]: "" }));
  };

  const updateForm = (key: keyof CompanyFormData, value: string) => {
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
      const additionalData = {
        first_name: form.firstName,
        last_name: form.lastName,
        company_name: form.companyName,
        industry: form.industry,
        company_description: form.companyDescription,
        wilaya: form.wilaya,
      };

      const verificationDocs: any = { tax_id: docs.taxId };
      if (docs.logo) verificationDocs.logo = await fileToBase64(docs.logo);
      if (docs.registrationCertificate)
        verificationDocs.registration_certificate = await fileToBase64(docs.registrationCertificate);

      await authService.markProfileCompleted(user.id, additionalData, verificationDocs);

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