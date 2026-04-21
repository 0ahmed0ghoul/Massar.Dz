// pages/MessagesPage.tsx
import ConversationsList from "../components/ConversationsList";
import MessagesList from "../components/MessagesList";
import { useMessages } from "../hooks/useMessages";


// If you want to use context, wrap; but for simplicity we'll use hook directly
const MessagesPageContent = () => {
  const { selectedConversationId, setSelectedConversationId } = useMessages();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations sidebar */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-black/10">
          <ConversationsList
            onSelectConversation={setSelectedConversationId}
            selectedId={selectedConversationId}
          />
        </div>
        {/* Active conversation */}
        <div className="md:col-span-2 border rounded-lg p-4 bg-black/10 min-h-[500px]">
          <MessagesList />
        </div>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  // Since useMessages is already providing state, we can use it directly
  // Alternatively, you could provide a context provider here if needed
  return <MessagesPageContent />;
};

export default MessagesPage;