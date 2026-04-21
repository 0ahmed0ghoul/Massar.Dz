import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useMessaging } from "../hooks/useMessaging";
import { MessageBubble } from "../components/MessageBubble";


export const ConversationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { messages, loading, loadMessages, sendMessage } = useMessaging();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    if (id) {
      loadMessages(id);
      // Determine receiver ID (the other participant)
      // We'll assume conversation object is passed via state or fetch conversation details.
      // For simplicity, we'll store receiverId in localStorage or derive from conversation.
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !id || !receiverId) return;
    await sendMessage(id, receiverId, input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="text-foreground/60 hover:text-foreground"><ArrowLeft className="h-5 w-5" /></button>
        <h2 className="text-foreground font-semibold">Conversation</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <div className="text-center text-foreground/40">Loading...</div>}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#639922]/50"
        />
        <button onClick={handleSend} className="rounded-xl bg-[#639922] p-2 text-foreground hover:bg-[#4f7a1a]"><Send className="h-5 w-5" /></button>
      </div>
    </div>
  );
};