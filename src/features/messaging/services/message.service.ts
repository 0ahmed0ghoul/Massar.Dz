// services/message.service.ts

import { Conversation, Message } from "../types/messaging";

const STORAGE_KEYS = {
  CONVERSATIONS: "messaging_conversations",
  MESSAGES: "messaging_messages",
};

// Mock helper to get current user ID (replace with real auth)
let currentUserId = ""; // will be set from auth context

export const setCurrentUser = (userId: string) => { currentUserId = userId; };

// Load from localStorage
const getStoredConversations = (): Conversation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
};

const getStoredMessages = (): Message[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : [];
};

const persistConversations = (conversations: Conversation[]) => {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
};

const persistMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

// Get all conversations for current user (student or university)
export const getConversations = async (): Promise<Conversation[]> => {
  const allConv = getStoredConversations();
  // Filter conversations where current user is either student or university
  const userConvs = allConv.filter(c => c.studentId === currentUserId || c.universityId === currentUserId);
  // Enrich with names (mock – in real app you'd join profiles)
  return userConvs;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const messages = getStoredMessages();
  return messages.filter(m => m.conversationId === conversationId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

// Send a new message
export const sendMessage = async (conversationId: string, receiverId: string, content: string): Promise<Message> => {
  const newMessage: Message = {
    id: crypto.randomUUID(),
    conversationId,
    senderId: currentUserId,
    receiverId,
    content,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  const messages = getStoredMessages();
  messages.push(newMessage);
  persistMessages(messages);

  // Update conversation's last message and timestamp
  const convs = getStoredConversations();
  const convIndex = convs.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    convs[convIndex].lastMessage = content;
    convs[convIndex].lastMessageAt = newMessage.createdAt;
    persistConversations(convs);
  }
  return newMessage;
};

// Create a new conversation (if not exists)
export const startConversation = async (studentId: string, universityId: string): Promise<Conversation> => {
  let convs = getStoredConversations();
  let existing = convs.find(c => c.studentId === studentId && c.universityId === universityId);
  if (existing) return existing;

  const newConv: Conversation = {
    id: crypto.randomUUID(),
    studentId,
    universityId,
    lastMessage: "",
    lastMessageAt: new Date().toISOString(),
  };
  convs.push(newConv);
  persistConversations(convs);
  return newConv;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string) => {
  const messages = getStoredMessages();
  const updated = messages.map(m => {
    if (m.conversationId === conversationId && m.receiverId === currentUserId && !m.isRead) {
      return { ...m, isRead: true };
    }
    return m;
  });
  persistMessages(updated);
};

// Get unread count for a conversation
export const getUnreadCount = async (conversationId: string): Promise<number> => {
  const messages = getStoredMessages();
  return messages.filter(m => m.conversationId === conversationId && m.receiverId === currentUserId && !m.isRead).length;
};