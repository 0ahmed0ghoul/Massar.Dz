import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessaging } from "../hooks/useMessaging";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { ConversationList } from "../components/ConversationList";


export const InboxPage = () => {
  const { conversations, loading, loadConversations } = useMessaging();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const userRole = profile?.role === "student" ? "student" : "university_admin";

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelect = (conv) => {
    navigate(`/messages/${conv.id}`);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-4">
          {loading ? <div className="text-center text-foreground/40">Loading...</div> : <ConversationList conversations={conversations} onSelect={handleSelect} currentUserRole={userRole} />}
        </div>
      </div>
    </div>
  );
};