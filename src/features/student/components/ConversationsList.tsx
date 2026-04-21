// components/messages/ConversationsList.tsx
import { useMessages } from "../hooks/useMessages";

interface ConversationsListProps {
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
}

const ConversationsList = ({ onSelectConversation, selectedId }: ConversationsListProps) => {
  const { conversations, loading } = useMessages();

  if (loading) {
    return <div className="text-foreground/40 text-sm">Loading conversations...</div>;
  }

  if (!conversations.length) {
    return <div className="text-foreground/40 text-sm">No messages yet.</div>;
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          className={`w-full text-left p-3 rounded-lg transition ${
            selectedId === conv.id
              ? "bg-primary/10 border-primary/20"
              : "hover:bg-white/5 border-transparent"
          } border`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground font-medium text-sm">{conv.otherParty.name}</p>
              <p className="text-foreground/40 text-xs truncate max-w-[200px]">
                {conv.last_message}
              </p>
            </div>
            <span className="text-foreground/30 text-xs">
              {new Date(conv.last_message_at || "").toLocaleDateString()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConversationsList;