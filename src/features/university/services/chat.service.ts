// features/university/services/chat.service.ts
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  read: boolean;
  created_at: string;
}

export interface ChatParticipant {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

class ChatService {
  private channel: RealtimeChannel | null = null;

  // ─────────────────────────────────────────────
  // GET ALL CHAT PARTICIPANTS (BASED ONLY ON MESSAGES)
  // ─────────────────────────────────────────────
  // In chat.service.ts

  async getConnectedStudents(universityId: string): Promise<ChatParticipant[]> {
    // 1. Get the current university admin (head_of_department) info
    const { data: currentAdmin, error: adminError } = await supabase
      .from("profiles")
      .select("id, university_name, first_name, last_name")
      .eq("id", universityId)
      .single();

    if (adminError) {
      console.error("Error fetching current admin:", adminError);
      return [];
    }

    // 2. Fetch the rectorate account to get the official university avatar
    const { data: rectorateAccount, error: rectorError } = await supabase
      .from("profiles")
      .select("id, avatar_url")
      .eq("role", "university_admin")
      .eq("university_name", currentAdmin?.university_name)
      .eq("univ_admin_type", "rectorate")
      .maybeSingle();

    if (rectorError) {
      console.error("Error fetching rectorate account:", rectorError);
    }

    // Use rectorate avatar if available
    const universityAvatar = rectorateAccount?.avatar_url || null;

    // 3. Get all unique user IDs that chatted with this university
    const { data: messages, error } = await supabase
      .from("messages")
      .select("sender_id, receiver_id, content, created_at")
      .or(`sender_id.eq.${universityId},receiver_id.eq.${universityId}`);

    if (error) throw new Error(error.message);

    const userIds = new Set<string>();

    messages.forEach((m) => {
      if (m.sender_id !== universityId) userIds.add(m.sender_id);
      if (m.receiver_id !== universityId) userIds.add(m.receiver_id);
    });

    if (userIds.size === 0) return [];

    // 4. Fetch profiles for those users (students)
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, student_id, first_name, last_name, email, avatar_url")
      .in("id", Array.from(userIds));

    if (profileError) throw new Error(profileError.message);

    // 5. Build conversations with the rectorate avatar
    const participants: ChatParticipant[] = [];

    for (const profile of profiles || []) {
      const otherId = profile.id;

      // last message
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at")
        .or(
          `and(sender_id.eq.${universityId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${universityId})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // unread count
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", universityId)
        .eq("sender_id", otherId)
        .eq("read", false);

      participants.push({
        id: profile.id,
        student_id: profile.student_id || profile.id,
        full_name: `${profile.first_name || ""} ${
          profile.last_name || ""
        }`.trim(),
        email: profile.email || "",
        avatar_url: profile.avatar_url,
        last_message: lastMsg?.content,
        last_message_time: lastMsg?.created_at,
        unread_count: unreadCount || 0,
      });
    }

    // 6. Sort by latest message
    participants.sort((a, b) => {
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return (
        new Date(b.last_message_time).getTime() -
        new Date(a.last_message_time).getTime()
      );
    });

    return participants;
  }

  // ─────────────────────────────────────────────
  // GET MESSAGES
  // ─────────────────────────────────────────────
  async getMessages(
    userId1: string,
    userId2: string,
    limit = 50
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`
      )
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
  }

  // ─────────────────────────────────────────────
  // UPLOAD FILE
  // ─────────────────────────────────────────────
  async uploadFile(
    file: File,
    folder = "chat-files"
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("chat-attachments")
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }

  // ─────────────────────────────────────────────
  // SEND MESSAGE (WITH FILE)
  // ─────────────────────────────────────────────
  async sendMessageWithFile(
    senderId: string,
    receiverId: string,
    content: string,
    file?: File
  ): Promise<Message> {
    let fileUrl: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const uploaded = await this.uploadFile(file);
      fileUrl = uploaded.url;
      fileName = file.name;
      fileType = file.type;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content || (file ? "📎 File" : ""),
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

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.sendMessageWithFile(senderId, receiverId, content);
  }

  // ─────────────────────────────────────────────
  // MARK AS READ
  // ─────────────────────────────────────────────
  async markAsRead(receiverId: string, senderId: string): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("receiver_id", receiverId)
      .eq("sender_id", senderId)
      .eq("read", false);

    if (error) throw new Error(error.message);
  }

  // ─────────────────────────────────────────────
  // REALTIME
  // ─────────────────────────────────────────────
  subscribeToMessages(
    userId: string,
    onNewMessage: (msg: Message) => void
  ): RealtimeChannel {
    this.unsubscribe();

    const channelName = `messages-${userId}-${Date.now()}`;

    this.channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
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

export const chatService = new ChatService();
