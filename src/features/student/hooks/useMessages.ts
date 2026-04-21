// hooks/useMessages.ts
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Tables } from "@/types/database";

type Conversation = Tables<"conversations"> & {
  otherParty: {
    id: string;
    name: string;
    role: "student" | "university";
  };
};

type Message = Tables<"messages">;

// Mock conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    student_id: "student-123",
    university_id: "uni-456",
    last_message: "When will I receive the admission decision?",
    last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    otherParty: {
      id: "uni-456",
      name: "University of Algiers",
      role: "university",
    },
  },
  {
    id: "conv-002",
    student_id: "student-123",
    university_id: "uni-789",
    last_message: "Thank you for your application!",
    last_message_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    otherParty: {
      id: "uni-789",
      name: "USTHB",
      role: "university",
    },
  },
];

// Mock messages for each conversation
const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-001": [
    {
      id: "msg-001",
      conversation_id: "conv-001",
      sender_id: "student-123",
      receiver_id: "uni-456",
      content: "Hello, I applied for Computer Science last week. What's the status?",
      is_read: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-002",
      conversation_id: "conv-001",
      sender_id: "uni-456",
      receiver_id: "student-123",
      content: "Your application is being reviewed. We'll notify you within 2 weeks.",
      is_read: true,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-003",
      conversation_id: "conv-001",
      sender_id: "student-123",
      receiver_id: "uni-456",
      content: "When will I receive the admission decision?",
      is_read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  "conv-002": [
    {
      id: "msg-004",
      conversation_id: "conv-002",
      sender_id: "uni-789",
      receiver_id: "student-123",
      content: "Thank you for your application! Please submit your transcripts.",
      is_read: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-005",
      conversation_id: "conv-002",
      sender_id: "student-123",
      receiver_id: "uni-789",
      content: "I've uploaded the documents. Anything else?",
      is_read: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-006",
      conversation_id: "conv-002",
      sender_id: "uni-789",
      receiver_id: "student-123",
      content: "Thank you for your application!",
      is_read: false,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch conversations for current user
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // For mock, we assume user is a student with id "student-123"
      // In real app, filter by user.id and map otherParty based on role
      setConversations(MOCK_CONVERSATIONS);
      setLoading(false);
    };

    fetchConversations();
  }, [user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMessages(MOCK_MESSAGES[selectedConversationId] || []);
    };

    fetchMessages();
  }, [selectedConversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !user || !content.trim()) return;

      const conversation = conversations.find((c) => c.id === selectedConversationId);
      if (!conversation) return;

      // Determine receiver_id
      const receiverId = user.id === conversation.student_id
        ? conversation.university_id
        : conversation.student_id;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: selectedConversationId,
        sender_id: user.id,
        receiver_id: receiverId,
        content: content.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Optimistically add to messages
      setMessages((prev) => [...prev, newMessage]);

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? { ...c, last_message: content.trim(), last_message_at: new Date().toISOString() }
            : c
        )
      );

      // In a real app, you would POST to API here
    },
    [selectedConversationId, user, conversations]
  );

  return {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    loading,
  };
};