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

  // Get all connected students for this university admin
  async getConnectedStudents(universityId: string): Promise<ChatParticipant[]> {
    const { data: connections, error: connError } = await supabase
      .from('department_connections')
      .select('student_id')
      .eq('university_id', universityId)
      .eq('status', 'accepted');
    if (connError) throw new Error(connError.message);
    if (!connections.length) return [];

    const studentIds = connections.map(c => c.student_id);
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, student_id, first_name, last_name, email, avatar_url')
      .in('id', studentIds);
    if (profileError) throw new Error(profileError.message);

    const participants: ChatParticipant[] = [];
    for (const profile of profiles) {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, created_at')
        .or(`and(sender_id.eq.${universityId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${universityId})`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', universityId)
        .eq('sender_id', profile.id)
        .eq('read', false);

      participants.push({
        id: profile.id,
        student_id: profile.student_id || '',
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || '',
        avatar_url: profile.avatar_url,
        last_message: lastMsg?.content,
        last_message_time: lastMsg?.created_at,
        unread_count: unreadCount || 0,
      });
    }

    participants.sort((a, b) => {
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
    });
    return participants;
  }

  async getMessages(userId1: string, userId2: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Upload file to Supabase Storage
  async uploadFile(file: File, folder = 'chat-files'): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath);
    return { url: publicUrl, path: filePath };
  }

  // Send a message with optional file attachment
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
      const { url } = await this.uploadFile(file);
      fileUrl = url;
      fileName = file.name;
      fileType = file.type;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content || (file ? '📎 Sent a file' : ''),
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

  // Legacy sendMessage (without file) – keep for backward compatibility
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    return this.sendMessageWithFile(senderId, receiverId, content);
  }

  async markAsRead(receiverId: string, senderId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', receiverId)
      .eq('sender_id', senderId)
      .eq('read', false);
    if (error) throw new Error(error.message);
  }

  subscribeToMessages(userId: string, onNewMessage: (message: Message) => void): RealtimeChannel {
    // Clean previous subscription
    this.unsubscribe();
    const channelName = `messages-${userId}-${Date.now()}`;
    this.channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
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

  async getStudentConnectedUniversity(studentId: string): Promise<ChatParticipant | null> {
    const { data: connection, error: connError } = await supabase
      .from('department_connections')
      .select('university_id')
      .eq('student_id', studentId)
      .eq('status', 'accepted')
      .maybeSingle();
    if (connError) throw new Error(connError.message);
    if (!connection) return null;

    const universityId = connection.university_id;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, avatar_url, university_name')
      .eq('id', universityId)
      .single();
    if (profileError) throw new Error(profileError.message);

    const { data: lastMsg } = await supabase
      .from('messages')
      .select('content, created_at')
      .or(`and(sender_id.eq.${studentId},receiver_id.eq.${universityId}),and(sender_id.eq.${universityId},receiver_id.eq.${studentId})`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { count: unreadCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', studentId)
      .eq('sender_id', universityId)
      .eq('read', false);

    return {
      id: profile.id,
      student_id: profile.id,
      full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.university_name || 'University',
      email: profile.email || '',
      avatar_url: profile.avatar_url,
      last_message: lastMsg?.content,
      last_message_time: lastMsg?.created_at,
      unread_count: unreadCount || 0,
    };
  }
}

export const chatService = new ChatService();