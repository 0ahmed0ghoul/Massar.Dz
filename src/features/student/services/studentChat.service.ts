// features/student/services/studentChat.service.ts
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@/features/university/services/chat.service";
import { StudentConversation } from "@/types/student";

class StudentChatService {
  private channel: RealtimeChannel | null = null;

  // Get university conversation from the student's own profile (no join table)
  async getConnectedUniversity(studentId: string): Promise<StudentConversation | null> {
    try {
      // 1. Get student profile
      const { data: student, error: studentError } = await supabase
        .from("profiles")
        .select("university_name, university_connection_status")
        .eq("id", studentId)
        .single();
  
      if (studentError || !student?.university_name) {
        return null;
      }
  
      if (student.university_connection_status !== "connected") {
        return null;
      }
  
      // 2. Get head of department for user info
      const { data: headOfDepartment, error: headError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, university_name")
        .eq("role", "university_admin")
        .eq("university_name", student.university_name)
        .eq("univ_admin_type", "head_of_department")
        .maybeSingle();
  
      if (headError || !headOfDepartment) {
        console.error("No head_of_department found");
        return null;
      }
  
      // 3. Get rectorate account for avatar
      const { data: rectorate, error: rectorError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("role", "university_admin")
        .eq("university_name", student.university_name)
        .eq("univ_admin_type", "rectorate")
        .maybeSingle();
  
      if (rectorError) {
        console.error("Error fetching rectorate:", rectorError);
      }
  
      // Use rectorate avatar if available
      const universityAvatar = rectorate?.avatar_url || null;
  
      console.log("✅ Found head_of_department:", headOfDepartment.id);
      console.log("✅ Using rectorate avatar:", universityAvatar ? "Yes" : "No");
  
      // 4. Get last message
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at")
        .or(
          `and(sender_id.eq.${studentId},receiver_id.eq.${headOfDepartment.id}),` +
          `and(sender_id.eq.${headOfDepartment.id},receiver_id.eq.${studentId})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
  
      // 5. Get unread count
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", studentId)
        .eq("sender_id", headOfDepartment.id)
        .eq("read", false);
  
      return {
        id: headOfDepartment.id,
        universityName: headOfDepartment.university_name,
        universityAvatar: universityAvatar, // ✅ Rectorate's avatar
        lastMessage: lastMsg?.content || null,
        lastMessageAt: lastMsg?.created_at || null,
        unreadCount: count || 0,
      };
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    }
  }

  // Fetch messages between student and university (or company)
  async getMessages(
    studentId: string,
    otherPartyId: string,
    limit = 50
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${studentId},receiver_id.eq.${otherPartyId}),and(sender_id.eq.${otherPartyId},receiver_id.eq.${studentId})`
      )
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Send a message from student to university/company
  async sendMessage(
    studentId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: studentId,
        receiver_id: receiverId,
        content,
        read: false,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async uploadFile(
    file: File,
    folder = "chat-files"
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-attachments")
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat-attachments").getPublicUrl(filePath);
    return { url: publicUrl, path: filePath };
  }

  async sendMessageWithFile(
    studentId: string,
    receiverId: string,
    content: string,
    file?: File
  ): Promise<Message> {
    let fileUrl: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const { url } = await this.uploadFile(file);
      fileUrl = url;
      fileName = file.name;
      fileType = file.type;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: studentId,
        receiver_id: receiverId,
        content: content || (file ? "📎 Sent a file" : ""),
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        read: false,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async markAsRead(studentId: string, senderId: string): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("receiver_id", studentId)
      .eq("sender_id", senderId)
      .eq("read", false);
    if (error) throw new Error(error.message);
  }

  async getCompanyConversations(
    studentId: string
  ): Promise<StudentConversation[]> {
    // Fetch distinct company IDs from applications
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("job:jobs(company_id)")
      .eq("student_id", studentId);
    if (appsError) throw new Error(appsError.message);

    const companyIds = new Set<string>();
    applications.forEach((app) => {
      const companyId = app.job?.company_id;
      if (companyId) companyIds.add(companyId);
    });
    if (companyIds.size === 0) return [];

    // Fetch company profiles
    const { data: companies, error: compError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url, company_name")
      .in("id", Array.from(companyIds));
    if (compError) throw new Error(compError.message);

    const conversations: StudentConversation[] = [];
    for (const company of companies) {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at")
        .or(
          `and(sender_id.eq.${studentId},receiver_id.eq.${company.id}),and(sender_id.eq.${company.id},receiver_id.eq.${studentId})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", studentId)
        .eq("sender_id", company.id)
        .eq("read", false);

      conversations.push({
        id: company.id,
        universityName:
          company.company_name ||
          `${company.first_name || ""} ${company.last_name || ""}`.trim(),
        universityAvatar: company.avatar_url,
        lastMessage: lastMsg?.content || null,
        lastMessageAt: lastMsg?.created_at || null,
        unreadCount: unreadCount || 0,
        role: "company",
      });
    }
    return conversations;
  }

  subscribeToMessages(
    studentId: string,
    onNewMessage: (message: Message) => void
  ): RealtimeChannel {
    this.unsubscribe();
    const channelName = `student-messages-${studentId}-${Date.now()}`;
    this.channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${studentId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();
    return this.channel;
  }

  unsubscribe() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const studentChatService = new StudentChatService();
