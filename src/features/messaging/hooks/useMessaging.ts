// hooks/useMessaging.ts
import { useState, useEffect, useCallback } from "react";
import { Conversation } from "../types/messaging";
import { Message } from "postcss";
import * as messageService from "../services/message.service";

export const useMessaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    const data = await messageService.getConversations();
    setConversations(data);
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    const data = await messageService.getMessages(conversationId);
    setMessages(data);
    await messageService.markMessagesAsRead(conversationId);
    setLoading(false);
  }, []);

  const sendMessage = useCallback(async (conversationId: string, receiverId: string, content: string) => {
    if (!content.trim()) return;
    setSending(true);
    const newMsg = await messageService.sendMessage(conversationId, receiverId, content);
    setMessages(prev => [...prev, newMsg]);
    // Update conversation list (last message)
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessage: content, lastMessageAt: newMsg.createdAt } : c));
    setSending(false);
    return newMsg;
  }, []);

  const startConversation = useCallback(async (studentId: string, universityId: string) => {
    const conv = await messageService.startConversation(studentId, universityId);
    await loadConversations();
    return conv;
  }, [loadConversations]);

  return {
    conversations,
    messages,
    loading,
    sending,
    loadConversations,
    loadMessages,
    sendMessage,
    startConversation,
  };
};