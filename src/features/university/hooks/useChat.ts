// features/university/hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { chatService, Message, ChatParticipant } from '../services/chat.service';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useChat(adminId: string, selectedStudentId?: string) {
  const [students, setStudents] = useState<ChatParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { toast } = useToast();

  const loadStudents = useCallback(async () => {
    if (!adminId) return;
    try {
      const data = await chatService.getConnectedStudents(adminId);
      setStudents(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [adminId, toast]);

  const loadMessages = useCallback(async () => {
    if (!adminId || !selectedStudentId) return;
    try {
      const msgs = await chatService.getMessages(adminId, selectedStudentId);
      setMessages(msgs);
      await chatService.markAsRead(adminId, selectedStudentId);
      setStudents(prev => prev.map(s => 
        s.id === selectedStudentId ? { ...s, unread_count: 0 } : s
      ));
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [adminId, selectedStudentId, toast]);

  // Send text message only (no file)
  const sendMessage = async (content: string) => {
    if (!adminId || !selectedStudentId || !content.trim()) return;
    setSending(true);
    try {
      const newMsg = await chatService.sendMessage(adminId, selectedStudentId, content);
      setMessages(prev => [...prev, newMsg]);
      setStudents(prev => prev.map(s => 
        s.id === selectedStudentId 
          ? { ...s, last_message: content, last_message_time: new Date().toISOString() }
          : s
      ));
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  // Send message with optional file attachment
  const sendMessageWithFile = async (content: string, file?: File) => {
    if (!adminId || !selectedStudentId) return;
    if (!content.trim() && !file) return;
    setUploading(true);
    try {
      const newMsg = await chatService.sendMessageWithFile(adminId, selectedStudentId, content, file);
      setMessages(prev => [...prev, newMsg]);
      setStudents(prev => prev.map(s => 
        s.id === selectedStudentId 
          ? { ...s, last_message: newMsg.content, last_message_time: newMsg.created_at }
          : s
      ));
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!adminId) return;
    const handleNewMessage = (message: Message) => {
      if (selectedStudentId === message.sender_id) {
        setMessages(prev => [...prev, message]);
        chatService.markAsRead(adminId, message.sender_id);
      } else {
        setStudents(prev => prev.map(s => 
          s.id === message.sender_id 
            ? { ...s, unread_count: (s.unread_count || 0) + 1, last_message: message.content, last_message_time: message.created_at }
            : s
        ));
        const student = students.find(s => s.id === message.sender_id);
        if (student) {
          toast({
            title: `New message from ${student.full_name}`,
            description: message.content.slice(0, 50),
          });
        }
      }
    };
    const sub = chatService.subscribeToMessages(adminId, handleNewMessage);
    setChannel(sub);
    return () => {
      chatService.unsubscribe();
    };
  }, [adminId, selectedStudentId, students, toast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (selectedStudentId) {
      loadMessages();
    }
  }, [selectedStudentId, loadMessages]);

  return {
    students,
    messages,
    loading: loading && students.length === 0,
    sending,
    uploading,
    sendMessage,
    sendMessageWithFile,
    refreshStudents: loadStudents,
  };
}