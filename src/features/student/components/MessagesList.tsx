// components/messages/MessagesList.tsx
import { useMessages } from "../hooks/useMessages";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

const MessagesList = () => {
  const { user } = useAuth();
  const { messages, selectedConversationId, sendMessage, conversations } = useMessages();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === selectedConversationId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage("");
  };

  if (!selectedConversationId) {
    return (
      <div className="flex items-center justify-center h-full text-foreground/40">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <h3 className="text-foreground font-medium">
          {currentConversation?.otherParty.name}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[400px]">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-foreground"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at || "").toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagesList;