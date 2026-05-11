// features/university/services/universityCertificate.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface CertificateRequest {
  id: string;
  student_id: string;
  type: 'major' | 'stars';
  achievements?: string[];
  proof_urls?: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    student_id: string;
  };
}

class UniversityCertificateService {
  // Fetch pending certificate requests for a given university admin
  async getPendingRequests(universityId: string): Promise<CertificateRequest[]> {
    // Get all accepted student connections
    const { data: connections, error: connError } = await supabase
      .from('department_connections')
      .select('student_id')
      .eq('university_id', universityId)
      .eq('status', 'accepted');
    if (connError) throw new Error(connError.message);
    if (!connections.length) return [];

    const studentIds = connections.map(c => c.student_id);
    // Fetch pending requests for those students
    const { data, error } = await supabase
      .from('certificate_requests')
      .select(`
        *,
        student:profiles!certificate_requests_student_id_fkey (
          id,
          first_name,
          last_name,
          email,
          student_id
        )
      `)
      .in('student_id', studentIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Upload the final certificate file (PDF/image) to storage and return URL
  async uploadCertificateFile(universityId: string, studentId: string, requestType: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `certificates/${universityId}/${studentId}/${requestType}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('university-files')
      .upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: { publicUrl } } = supabase.storage
      .from('university-files')
      .getPublicUrl(fileName);
    return publicUrl;
  }

  // Approve a request: insert into certificates table and update request status
  async approveRequest(
    requestId: string,
    certificateData: {
      title: string;
      issuer: string;
      issue_date: string;
      expiry_date?: string;
      credential_id?: string;
      file_url: string;
    }
  ): Promise<void> {
    // First get the request to know student_id
    const { data: request, error: fetchError } = await supabase
      .from('certificate_requests')
      .select('student_id, type, title, issuer, issue_date')
      .eq('id', requestId)
      .single();
    if (fetchError) throw new Error(fetchError.message);

    // Insert into certificates table
    const { error: insertError } = await supabase
      .from('certificates')
      .insert({
        user_id: request.student_id,
        type: request.type === 'stars' ? 'stars' : 'major',
        title: certificateData.title || request.title,
        issuer: certificateData.issuer || request.issuer,
        issue_date: certificateData.issue_date || request.issue_date,
        expiry_date: certificateData.expiry_date,
        file_url: certificateData.file_url,
        status: 'claimed'
      });
    if (insertError) throw new Error(insertError.message);

    // Update request status to approved
    const { error: updateError } = await supabase
      .from('certificate_requests')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', requestId);
    if (updateError) throw new Error(updateError.message);
  }

  // Reject a request (optional)
  async rejectRequest(requestId: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('certificate_requests')
      .update({ status: 'rejected', admin_comment: reason, updated_at: new Date().toISOString() })
      .eq('id', requestId);
    if (error) throw new Error(error.message);
  }
}

export const universityCertificateService = new UniversityCertificateService();