// features/student/hooks/useCertificates.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Certificate } from "@/types/certificate";

export interface PendingRequest {
  id: string;
  type: string;
  title: string;
  issuer: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  achievements?: string[];
  proof_urls?: Record<string, string>;
}

export function useCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Already issued certificates (using user_id and file_url)
      const { data: certs, error: certsError } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issue_date", { ascending: false });
      if (certsError) throw certsError;
      setCertificates(certs || []);

      // 2. Pending requests (not yet issued)
      const { data: requests, error: reqError } = await supabase
        .from("certificate_requests")
        .select("*")
        .eq("student_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (reqError) throw reqError;
      setPendingRequests(requests || []);
    } catch (err) {
      console.error("Failed to load certificates/requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const addCertificate = async (
    type: string,
    title: string,
    issuer: string,
    issueDate: string,
    expiryDate?: string,
    credentialId?: string,
    file?: File
  ) => {
    if (!user) throw new Error("Not authenticated");
    let fileUrl: string | null = null;
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/certificates/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("student-files")
        .upload(fileName, file);
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicUrlData } = supabase.storage.from("student-files").getPublicUrl(fileName);
      fileUrl = publicUrlData.publicUrl;
    }
    // ✅ Correct columns: user_id, file_url, status
    const { error } = await supabase.from("certificates").insert({
      user_id: user.id,
      type,
      title,
      issuer,
      issue_date: issueDate,
      expiry_date: expiryDate || null,
      credential_id: credentialId || null,
      file_url: fileUrl,
      status: "claimed",
    });
    if (error) throw new Error(error.message);
    await fetchData();
  };

  const claimGraduationCertificate = async (token: string) => {
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.rpc("claim_graduation_certificate", {
      p_token: token,
      p_student_id: user.id,
    });
    if (error) throw new Error(error.message);
    await fetchData();
    return data;
  };

  const refresh = () => fetchData();

  return {
    certificates,
    pendingRequests,
    loading,
    addCertificate,
    claimGraduationCertificate,
    refresh,
  };
}