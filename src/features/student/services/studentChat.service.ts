// features/student/services/studentChat.service.ts
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@/features/university/services/chat.service"; // reuse Message interface
import { StudentConversation } from "@/types/student";

class StudentChatService {
  private channel: RealtimeChannel | null = null;

  // Get the one university the student is connected to (accepted status)
  async getConnectedUniversity(
    studentId: string
  ): Promise<StudentConversation | null> {
    // Get accepted connection
    const { data: connection, error: connError } = await supabase
      .from("university_connections")
      .select("university_id")
      .eq("student_id", studentId)
      .eq("status", "accepted")
      .maybeSingle();

    if (connError) throw new Error(connError.message);
    if (!connection) return null;

    const universityId = connection.university_id;

    // Fetch university admin profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url, university_name")
      .eq("id", universityId)
      .single();
    if (profileError) throw new Error(profileError.message);

    const universityName =
      profile.university_name ||
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

    // Get last message between student and university
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .or(
        `and(sender_id.eq.${studentId},receiver_id.eq.${universityId}),and(sender_id.eq.${universityId},receiver_id.eq.${studentId})`
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Count unread messages for student (receiver)
    const { count: unreadCount } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", studentId)
      .eq("sender_id", universityId)
      .eq("read", false);

    return {
      id: universityId,
      universityName,
      universityAvatar: profile.avatar_url,
      lastMessage: lastMsg?.content || null,
      lastMessageAt: lastMsg?.created_at || null,
      unreadCount: unreadCount || 0,
    };
  }
  // Fetch messages between student and university
  async getMessages(
    studentId: string,
    universityId: string,
    limit = 50
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${studentId},receiver_id.eq.${universityId}),and(sender_id.eq.${universityId},receiver_id.eq.${studentId})`
      )
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Send a message from student to university
  async sendMessage(
    studentId: string,
    universityId: string,
    content: string
  ): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: studentId,
        receiver_id: universityId,
        content,
        read: false,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  // Upload file to Supabase Storage (reuse same bucket)
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
    universityId: string,
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
        receiver_id: universityId,
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
  // Mark messages as read (when student views conversation)
  async markAsRead(studentId: string, universityId: string): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("receiver_id", studentId)
      .eq("sender_id", universityId)
      .eq("read", false);
    if (error) throw new Error(error.message);
  }
  async getCompanyConversations(studentId: string): Promise<StudentConversation[]> {
    // 1. Fetch all applications by the student, get distinct company ids
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
  
    // 2. Fetch company profiles
    const { data: companies, error: compError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url, company_name")
      .in("id", Array.from(companyIds));
    if (compError) throw new Error(compError.message);
  
    const conversations: StudentConversation[] = [];
  
    for (const company of companies) {
      // Last message between student and this company
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at")
        .or(
          `and(sender_id.eq.${studentId},receiver_id.eq.${company.id}),and(sender_id.eq.${company.id},receiver_id.eq.${studentId})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
  
      // Unread messages for student
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", studentId)
        .eq("sender_id", company.id)
        .eq("read", false);
  
      conversations.push({
        id: company.id,
        universityName: company.company_name || `${company.first_name || ""} ${company.last_name || ""}`.trim(),
        universityAvatar: company.avatar_url,
        lastMessage: lastMsg?.content || null,
        lastMessageAt: lastMsg?.created_at || null,
        unreadCount: unreadCount || 0,
        role: "company", // add a flag to differentiate
      });
    }
  
    return conversations;
  }
  // Subscribe to new messages sent to the student
  subscribeToMessages(
    studentId: string,
    onNewMessage: (message: Message) => void
  ): RealtimeChannel {
    // Unsubscribe from any existing channel first
    this.unsubscribe();

    // Create a new channel with a unique name per subscription
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
