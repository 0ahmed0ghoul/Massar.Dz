import { MessageCircle, Building2, GraduationCap } from "lucide-react";
import { Conversation } from "../types/messaging";

interface Props {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conv: Conversation) => void;
  currentUserRole: "student" | "university_admin";
}

export const ConversationList = ({ conversations, selectedId, onSelect, currentUserRole }: Props) => {
  if (conversations.length === 0) {
    return <div className="text-center text-foreground/40 py-8">No conversations yet. Start one from a student profile or university page.</div>;
  }
  return (
    <div className="space-y-2">
      {conversations.map(conv => {
        const otherName = currentUserRole === "student" ? conv.universityName : `${conv.studentName} (Student)`;
        const otherAvatar = currentUserRole === "student" ? conv.universityLogo : conv.studentAvatar;
        const isSelected = conv.id === selectedId;
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`w-full text-left p-3 rounded-xl transition-all ${isSelected ? "bg-[#639922]/20 border border-[#639922]/30" : "hover:bg-white/5 border border-transparent"}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                {currentUserRole === "student" ? <Building2 className="h-5 w-5 text-foreground/60" /> : <GraduationCap className="h-5 w-5 text-foreground/60" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{otherName || "Unknown"}</p>
                <p className="text-xs text-foreground/40 truncate">{conv.lastMessage || "No messages yet"}</p>
              </div>
              {conv.unreadCount ? <span className="bg-[#639922] text-foreground text-xs rounded-full px-2 py-0.5">{conv.unreadCount}</span> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};