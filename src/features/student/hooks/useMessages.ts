// hooks/useMessaging.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { chatService, Message } from "@/features/university/services/chat.service";
import { studentChatService } from "@/features/student/services/studentChat.service";
import { Conversation } from "@/types/message";
import { supabase } from "@/lib/supabaseClient";

export const useMessaging = () => {
  const { user, profile } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ─────────────────────────────────────────────
  // LOAD CONVERSATIONS
  // ─────────────────────────────────────────────
const loadConversations = useCallback(async () => {
  if (!user) return;

  setLoadingConversations(true);
  try {
    let convs: Conversation[] = [];

    if (profile?.role === "student") {
      const [university, companies] = await Promise.all([
        studentChatService.getConnectedUniversity(user.id),
        studentChatService.getCompanyConversations(user.id),
      ]);

      // University - only add if connection is approved
      if (university?.id) {
        convs.push({
          id: university.id,
          otherPartyId: university.id,
          otherPartyAvatar: university.universityAvatar || null,
          otherPartyName: university.universityName || "University",
          otherPartyRole: "university",
          lastMessage: university.lastMessage || null,
          lastMessageAt: university.lastMessageAt || null,
          unreadCount: university.unreadCount || 0,
        });
      } else {
        console.log("No approved university connection found");
      }

      // Companies (SAFE)
      companies.forEach((comp) => {
        if (!comp?.id) return;

        convs.push({
          id: comp.id,
          otherPartyId: comp.id,
          otherPartyAvatar: comp.universityAvatar || null,
          otherPartyName: comp.universityName || "Company",
          otherPartyRole: "company",
          lastMessage: comp.lastMessage || null,
          lastMessageAt: comp.lastMessageAt || null,
          unreadCount: comp.unreadCount || 0,
        });
      });
    }

    // Sort conversations: put university at the top
    if (profile?.role === "student") {
      convs.sort((a, b) => {
        if (a.otherPartyRole === "university") return -1;
        if (b.otherPartyRole === "university") return 1;
        return 0;
      });
    }

    if (profile?.role === "university_admin") {
      const participants = await chatService.getConnectedStudents(user.id);

      convs = participants
        .filter((p) => p?.id)
        .map((p) => ({
          id: p.id,
          otherPartyId: p.id,
          otherPartyAvatar: p.avatar_url || null,
          otherPartyName: p.full_name || "Student",
          otherPartyRole: "student",
          lastMessage: p.last_message || null,
          lastMessageAt: p.last_message_time || null,
          unreadCount: p.unread_count || 0,
        }));
    }

    setConversations(convs);
  } catch (error) {
    console.error("Failed to load conversations", error);
  } finally {
    setLoadingConversations(false);
  }
}, [user, profile]);

  // ─────────────────────────────────────────────
  // LOAD MESSAGES
  // ─────────────────────────────────────────────
  const loadMessages = useCallback(
    async (otherPartyId: string) => {
      if (!user || !otherPartyId) return;

      setLoadingMessages(true);
      try {
        let msgs: Message[] = [];

        if (profile?.role === "student") {
          msgs = await studentChatService.getMessages(user.id, otherPartyId);
          await studentChatService.markAsRead(user.id, otherPartyId);
        } else {
          msgs = await chatService.getMessages(user.id, otherPartyId);
          await chatService.markAsRead(user.id, otherPartyId);
        }

        setMessages(msgs);
        setSelectedConversationId(otherPartyId);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === otherPartyId ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    },
    [user, profile]
  );

  // ─────────────────────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────────────────────
  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (!user || !content.trim() || !receiverId) return;

      setSending(true);
      try {
        let newMsg: Message;

        if (profile?.role === "student") {
          newMsg = await studentChatService.sendMessage(
            user.id,
            receiverId,
            content
          );
        } else {
          newMsg = await chatService.sendMessage(user.id, receiverId, content);
        }

        setMessages((prev) => [...prev, newMsg]);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === receiverId
              ? {
                  ...c,
                  lastMessage: content,
                  lastMessageAt: newMsg.created_at,
                }
              : c
          )
        );

        return newMsg;
      } catch (error) {
        console.error("Failed to send message", error);
      } finally {
        setSending(false);
      }
    },
    [user, profile]
  );

  // ─────────────────────────────────────────────
  // SEND FILE MESSAGE
  // ─────────────────────────────────────────────
  const sendMessageWithFile = useCallback(
    async (receiverId: string, content: string, file?: File) => {
      if (!user || !receiverId) return;
      if (!content.trim() && !file) return;

      setUploading(true);
      try {
        let newMsg: Message;

        if (profile?.role === "student") {
          newMsg = await studentChatService.sendMessageWithFile(
            user.id,
            receiverId,
            content,
            file
          );
        } else {
          newMsg = await chatService.sendMessageWithFile(
            user.id,
            receiverId,
            content,
            file
          );
        }

        setMessages((prev) => [...prev, newMsg]);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === receiverId
              ? {
                  ...c,
                  lastMessage: newMsg.content,
                  lastMessageAt: newMsg.created_at,
                }
              : c
          )
        );

        return newMsg;
      } catch (error) {
        console.error("Failed to send message with file", error);
      } finally {
        setUploading(false);
      }
    },
    [user, profile]
  );

  // ─────────────────────────────────────────────
  // REALTIME
  // ─────────────────────────────────────────────

useEffect(() => {
  if (!user || profile?.role !== "student") return;

  // Subscribe to profile changes to detect when university connection status changes
  const profileChannel = supabase
    .channel(`profile-${user.id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${user.id}`,
      },
      (payload) => {
        // If university_connection_status changed to "connected", reload conversations
        if (payload.new.university_connection_status === "connected") {
          console.log("University connection approved! Reloading conversations...");
          loadConversations();
        }
      }
    )
    .subscribe();

  return () => {
    profileChannel.unsubscribe();
  };
}, [user, profile?.role, loadConversations]);

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    selectedConversationId,
    loadingConversations,
    loadingMessages,
    sending,
    uploading,
    setSelectedConversationId,
    loadConversations,
    loadMessages,
    sendMessage,
    sendMessageWithFile,
  };
};