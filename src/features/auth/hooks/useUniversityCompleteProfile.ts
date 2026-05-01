// hooks/useUniversityCompleteProfile.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "../service/auth.service";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/domain/profile.types";

interface UniversityFormData {
  firstName: string;
  lastName: string;
  wilaya: string;
  universityName: string;
  rectorName: string;
  website: string;
  department: string;
  position: string;
}

interface DocsState {
  logo: File | null;
  registrationCertificate: File | null;
  taxId: string;
}

export function useUniversityCompleteProfile(user: User | null, profile: Profile | null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UniversityFormData>({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    wilaya: profile?.wilaya || "",
    universityName: profile?.university_name || "",
    rectorName: profile?.rector_name || "",
    website: profile?.website || "",
    department: profile?.department || "",
    position: profile?.position || "",
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

  const handleFileChange = (field: "logo" | "certificate", file: File | null) => {
    if (!file) return;

    // File validation
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (field === "logo" && !isImage) {
      toast({ title: "Invalid file", description: "Logo must be an image (JPG, PNG).", variant: "destructive" });
      return;
    }
    if (field === "certificate" && !isImage && !isPDF) {
      toast({ title: "Invalid file", description: "Certificate must be an image or PDF.", variant: "destructive" });
      return;
    }

    // Size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
      return;
    }

    console.log(`File uploaded for ${field}:`, file.name, file.size);
    setDocs((prev) => ({ ...prev, [field]: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [field]: url }));
  };

  const removeFile = (field: "logo" | "certificate") => {
    setDocs((prev) => ({ ...prev, [field]: null }));
    setPreviewUrls((prev) => ({ ...prev, [field]: "" }));
  };

  const updateForm = (key: keyof UniversityFormData, value: string) => {
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
        university_name: form.universityName,
        rector_name: form.rectorName,
        website: form.website,
        wilaya: form.wilaya,
        department: form.department,
        position: form.position,
      };

      const verificationDocs: any = { tax_id: docs.taxId };

      // Convert logo
      if (docs.logo) {
        try {
          verificationDocs.logo = await fileToBase64(docs.logo);
          console.log("Logo converted to base64, length:", verificationDocs.logo.length);
        } catch (err) {
          console.error("Logo conversion failed:", err);
          toast({ title: "Error", description: "Failed to process logo file.", variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      // Convert registration certificate
      if (docs.registrationCertificate) {
        try {
          verificationDocs.registration_certificate = await fileToBase64(docs.registrationCertificate);
          console.log("Certificate converted to base64, length:", verificationDocs.registration_certificate.length);
        } catch (err) {
          console.error("Certificate conversion failed:", err);
          toast({ title: "Error", description: "Failed to process certificate file.", variant: "destructive" });
          setLoading(false);
          return;
        }
      } else {
        console.warn("No registration certificate file found in docs");
      }

      console.log("Final verificationDocs:", Object.keys(verificationDocs));
      await authService.markProfileCompleted(user.id, additionalData, verificationDocs);

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