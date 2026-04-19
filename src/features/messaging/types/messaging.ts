export interface Conversation {
    id: string;
    studentId: string;
    universityId: string;
    studentName?: string;
    studentAvatar?: string;
    universityName?: string;
    universityLogo?: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount?: number;
  }
  
  export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
  }