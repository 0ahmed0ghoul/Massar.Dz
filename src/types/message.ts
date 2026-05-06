export interface Conversation {
  id: string;
  otherPartyAvatar?: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyRole: 'university' | 'company' | 'student';
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}
