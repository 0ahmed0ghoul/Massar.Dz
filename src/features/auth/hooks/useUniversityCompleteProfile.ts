// hooks/useUniversityCompleteProfile.ts (fixed)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile.types";

interface UniversityFormData {
  firstName: string;
  lastName: string;
  wilaya: string;
  university_name: string;
  rector_name: string;
  website: string;
  department: string;
  email: string;
}

interface DocsState {
  logoFile: File | null;
  certBase64: string | null;
  taxId: string;
}

export function useUniversityCompleteProfile(
  user: User | null,
  profile: Profile | null
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UniversityFormData>({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    wilaya: profile?.wilaya || "",
    university_name: profile?.university_name || "",
    rector_name: profile?.rector_name || "",
    website: profile?.website || "",
    department: profile?.department || "",
    email: profile?.email || "",
  });

  const [docs, setDocs] = useState<DocsState>({
    logoFile: null,
    certBase64: null,
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

  // ---------------- FILE HANDLER ----------------
  const handleFileChange = async (
    field: "logo" | "certificate",
    file: File | null
  ) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if (field === "logo" && !isImage) {
      toast({
        title: "Invalid file",
        description: "Logo must be an image (JPG, PNG).",
        variant: "destructive",
      });
      return;
    }

    if (field === "certificate" && !isImage && !isPDF) {
      toast({
        title: "Invalid file",
        description: "Certificate must be an image or PDF.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    // ---------------- LOGO ----------------
    if (field === "logo") {
      setDocs((prev) => ({ ...prev, logoFile: file }));
      setPreviewUrls((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
      return;
    }

    // ---------------- CERTIFICATE ----------------
    const base64 = await fileToBase64(file);

    setDocs((prev) => ({
      ...prev,
      certBase64: base64,
    }));

    setPreviewUrls((prev) => ({
      ...prev,
      certificate: URL.createObjectURL(file),
    }));
  };

  // ---------------- REMOVE FILE ----------------
  const removeFile = (field: "logo" | "certificate") => {
    if (field === "logo") {
      setDocs((prev) => ({ ...prev, logoFile: null }));
      setPreviewUrls((prev) => ({ ...prev, logo: "" }));
    } else {
      setDocs((prev) => ({ ...prev, certBase64: null }));
      setPreviewUrls((prev) => ({ ...prev, certificate: "" }));
    }
  };

  const updateForm = (key: keyof UniversityFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateTaxId = (value: string) => {
    setDocs((prev) => ({ ...prev, taxId: value }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const additionalData = {
        first_name: form.firstName,
        last_name: form.lastName,
        university_name: form.university_name,
        rector_name: form.rector_name,
        website: form.website,
        wilaya: form.wilaya,
        department: form.department,
        email: form.email,
      };

      const verificationDocs: any = {
        tax_id: docs.taxId,
      };

      if (docs.certBase64) {
        verificationDocs.registration_certificate = docs.certBase64;
      }

      // ---------------- UPLOAD LOGO ----------------
      let logoUrl: string | undefined;

      if (docs.logoFile) {
        logoUrl = await authService.uploadUniversityLogo(
          user.id,
          docs.logoFile
        );
      }

      console.log("Final verificationDocs keys:", Object.keys(verificationDocs));

      await authService.markProfileCompleted(
        user.id,
        additionalData,
        verificationDocs,
        logoUrl
      );

      toast({
        title: "Profile submitted",
        description: "Your application is now pending admin approval.",
      });

      navigate("/pending-approval");
    } catch (error: any) {
      console.error("Submit error:", error);
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