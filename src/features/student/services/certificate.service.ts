import { supabase } from "@/lib/supabaseClient";
import { Certificate, GraduationToken } from "../../../types/certificate";

async function addActivity(userId: string, type: string, title: string, description?: string, metadata?: any) {
  try {
    await supabase.from("activities").insert({
      student_id: userId,
      type,
      title,
      description,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

export const certificateService = {
  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("issue_date", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async addCertificate(userId: string, cert: Omit<Certificate, "id" | "created_at" | "updated_at" | "user_id">): Promise<Certificate> {
    const { data, error } = await supabase
      .from("certificates")
      .insert([{ ...cert, user_id: userId, status: "claimed" }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    
    // Log activity
    await addActivity(userId, "certificate_added", `Added certificate: ${cert.title}`, cert.issuer);
    return data;
  },

  async deleteCertificate(certificateId: string): Promise<void> {
    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", certificateId);
    if (error) throw new Error(error.message);
  },

  async uploadCertificateFile(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `certificates/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("student-files")
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: { publicUrl } } = supabase.storage
      .from("student-files")
      .getPublicUrl(filePath);
    return publicUrl;
  },

  async generateGraduationToken(studentId: string, universityId: string, expiresInHours: number = 168): Promise<{ token: string; qrUrl: string }> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("graduation_tokens")
      .insert({ token, student_id: studentId, university_id: universityId, expires_at: expiresAt })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const qrUrl = `${window.location.origin}/student/scan?token=${token}`;
    return { token: data.token, qrUrl };
  },

  async claimGraduationCertificate(token: string, studentId: string): Promise<Certificate> {
    const { data: tokenData, error: tokenError } = await supabase
      .from("graduation_tokens")
      .select("*")
      .eq("token", token)
      .single();
    if (tokenError || !tokenData) throw new Error("Invalid token");
    if (tokenData.student_id !== studentId) throw new Error("Token not assigned to you");
    if (tokenData.scanned_at) throw new Error("Certificate already claimed");
    if (new Date(tokenData.expires_at) < new Date()) throw new Error("Token expired");

    const { data: uniProfile } = await supabase
      .from("profiles")
      .select("university_name")
      .eq("id", tokenData.university_id)
      .single();
    const universityName = uniProfile?.university_name || "University";

    const certificate = {
      user_id: studentId,
      type: "graduation",
      title: `Graduation Certificate - ${universityName}`,
      issuer: universityName,
      issue_date: new Date().toISOString().split("T")[0],
      status: "claimed",
      credential_id: tokenData.token,
    };
    const { data: cert, error: certError } = await supabase
      .from("certificates")
      .insert([certificate])
      .select()
      .single();
    if (certError) throw new Error(certError.message);

    await supabase
      .from("graduation_tokens")
      .update({ scanned_at: new Date().toISOString(), certificate_id: cert.id })
      .eq("id", tokenData.id);
    
    // Log activity for graduation certificate
    await addActivity(studentId, "certificate_added", `Claimed graduation certificate`, universityName);
    return cert;
  },

  async getPendingGraduationTokens(studentId: string): Promise<GraduationToken[]> {
    const { data, error } = await supabase
      .from("graduation_tokens")
      .select("*")
      .eq("student_id", studentId)
      .is("scanned_at", null)
      .gte("expires_at", new Date().toISOString());
    if (error) throw new Error(error.message);
    return data || [];
  },
};