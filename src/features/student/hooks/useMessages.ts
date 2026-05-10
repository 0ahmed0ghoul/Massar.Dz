// hooks/useMessaging.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  chatService,
  Message,
} from "@/features/university/services/chat.service";
import { studentChatService } from "@/features/student/services/studentChat.service";
import { Conversation } from "@/types/message";

export const useMessaging = () => {
  const { user, profile } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ─────────────────────────────────────────────
  // Load conversations
  // ─────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!user) return;

    setLoadingConversations(true);
    try {
      if (profile?.role === "student") {
        const [university, companies] = await Promise.all([
          studentChatService.getConnectedUniversity(user.id),
          studentChatService.getCompanyConversations(user.id),
        ]);

        const convs: Conversation[] = [];

        if (university) {
          convs.push({
            id: university.id,
            otherPartyId: university.id,
            otherPartyAvatar: university.universityAvatar,
            otherPartyName: university.universityName,
            otherPartyRole: "university",
            lastMessage: university.lastMessage,
            lastMessageAt: university.lastMessageAt,
            unreadCount: university.unreadCount,
          });
        }

        companies.forEach((comp) => {
          convs.push({
            id: comp.id,
            otherPartyId: comp.id,
            otherPartyAvatar: comp.universityAvatar,
            otherPartyName: comp.universityName,
            otherPartyRole: "company",
            lastMessage: comp.lastMessage,
            lastMessageAt: comp.lastMessageAt,
            unreadCount: comp.unreadCount,
          });
        });

        setConversations(convs);
      }

      if (profile?.role === "university_admin") {
        const participants = await chatService.getConnectedStudents(user.id);

        const convs: Conversation[] = participants.map((p) => ({
          id: p.id,
          otherPartyId: p.id,
          otherPartyAvatar: p.avatar_url,
          otherPartyName: p.full_name,
          otherPartyRole: "student",
          lastMessage: p.last_message || null,
          lastMessageAt: p.last_message_time || null,
          unreadCount: p.unread_count,
        }));

        setConversations(convs);
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoadingConversations(false);
    }
  }, [user, profile]);

  // ─────────────────────────────────────────────
  // Load messages (IMPORTANT FIX)
  // ─────────────────────────────────────────────
  const loadMessages = useCallback(
    async (otherPartyId: string) => {
      if (!user) return;

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

        // reset unread count
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
  // Send message
  // ─────────────────────────────────────────────
  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (!user || !content.trim()) return;

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
        throw error;
      } finally {
        setSending(false);
      }
    },
    [user, profile]
  );

  // ─────────────────────────────────────────────
  // Send with file
  // ─────────────────────────────────────────────
  const sendMessageWithFile = useCallback(
    async (receiverId: string, content: string, file?: File) => {
      if (!user) return;
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
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [user, profile]
  );

  // ─────────────────────────────────────────────
  // Start conversation (USE THIS IN UI)
  // ─────────────────────────────────────────────
  const startConversation = useCallback(
    async (otherPartyId: string) => {
      await loadMessages(otherPartyId);
    },
    [loadMessages]
  );

  // ─────────────────────────────────────────────
  // Real-time updates (FIXED)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (message: Message) => {
      const otherId =
        message.sender_id === user.id ? message.receiver_id : message.sender_id;

      // If open conversation → append
      if (selectedConversationId === otherId) {
        setMessages((prev) => [...prev, message]);

        if (profile?.role === "student") {
          studentChatService.markAsRead(user.id, otherId);
        } else {
          chatService.markAsRead(user.id, otherId);
        }
      } else {
        // Update conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === otherId
              ? {
                  ...c,
                  unreadCount: (c.unreadCount || 0) + 1,
                  lastMessage: message.content,
                  lastMessageAt: message.created_at,
                }
              : c
          )
        );
      }
    };

    let channel: any;

    if (profile?.role === "student") {
      channel = studentChatService.subscribeToMessages(
        user.id,
        handleNewMessage
      );
    } else {
      channel = chatService.subscribeToMessages(user.id, handleNewMessage);
    }

    return () => {
      if (profile?.role === "student") {
        studentChatService.unsubscribe();
      } else {
        chatService.unsubscribe();
      }
    };
  }, [user, profile, selectedConversationId]);

  // ─────────────────────────────────────────────
  // Init
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
    startConversation,
    sendMessage,
    sendMessageWithFile,
  };
};
