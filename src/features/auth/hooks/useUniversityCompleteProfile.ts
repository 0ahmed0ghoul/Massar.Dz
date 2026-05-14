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
  univ_admin_type: string;
}

interface DocsState {
  avatar_url: File | null;  // Changed from logoFile
  rectorateProof: File | null;  // Changed from certBase64
  headOfDeptProof: File | null;  // Changed from certBase64
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
    univ_admin_type: profile?.univ_admin_type || "",
  });

  const [docs, setDocs] = useState<DocsState>({
    avatar_url: null,
    rectorateProof: null,
    headOfDeptProof: null,
    taxId: "",
  });

  const [previewUrls, setPreviewUrls] = useState({
    avatar_url: "",
    rectorateProof: "",
    headOfDeptProof: "",
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
    field: "avatar_url" | "rectorateProof" | "headOfDeptProof",
    file: File | null
  ) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if (field === "avatar_url" && !isImage) {
      toast({
        title: "Invalid file",
        description: "Logo must be an image (JPG, PNG).",
        variant: "destructive",
      });
      return;
    }

    if ((field === "rectorateProof" || field === "headOfDeptProof") && !isImage && !isPDF) {
      toast({
        title: "Invalid file",
        description: "Verification document must be an image or PDF.",
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

    // Store file for later upload
    setDocs((prev) => ({ ...prev, [field]: file }));
    setPreviewUrls((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
  };

  // ---------------- REMOVE FILE ----------------
  const removeFile = (field: "avatar_url" | "rectorateProof" | "headOfDeptProof") => {
    if (previewUrls[field]) {
      URL.revokeObjectURL(previewUrls[field]);
    }
    setDocs((prev) => ({ ...prev, [field]: null }));
    setPreviewUrls((prev) => ({ ...prev, [field]: "" }));
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

      // Upload avatar/logo if exists
      let avatarUrl: string | undefined;
      if (docs.avatar_url) {
        avatarUrl = await authService.uploadUniversityAvatar(
          user.id,
          docs.avatar_url
        );
      }

      // Upload verification document if exists
      const proofDoc = form.univ_admin_type === "rectorate" ? docs.rectorateProof : docs.headOfDeptProof;
      let verificationDocUrl: string | undefined;
      if (proofDoc) {
        verificationDocUrl = await authService.uploadVerificationDocument(
          user.id,
          proofDoc,
          form.univ_admin_type
        );
      }

      // Prepare verification docs object
      const verificationDocs: any = {
        tax_id: docs.taxId,
      };

      if (verificationDocUrl) {
        verificationDocs.registration_certificate = verificationDocUrl;
      }

      await authService.markProfileCompleted(
        user.id,
        additionalData,
        verificationDocs,
        avatarUrl
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