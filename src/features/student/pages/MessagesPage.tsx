// pages/MessagesPage.tsx
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Building2,
  MessageCircle,
  Paperclip,
  X,
  File,
  Image as ImageIcon,
  Pin,
  Briefcase,
  Loader2,
  Search,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { useMessaging } from "../hooks/useMessages";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = today.getDate() - d.getDate();
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single conversation list item */
function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: any;
  active: boolean;
  onClick: () => void;
}) {
  const isUniversity = conv.otherPartyRole === "university";
  const Icon = isUniversity ? Building2 : Briefcase;
  const iconColor = isUniversity ? "text-[#639922]" : "text-sky-400";
  const unreadColor = isUniversity ? "bg-[#639922]" : "bg-sky-500";

  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left rounded-xl px-3 py-3 transition-all duration-150
        ${
          active
            ? "bg-[#639922]/10 border border-[#639922]/20"
            : "border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold
            ${
              active
                ? "border-[#639922]/30 bg-[#639922]/15 text-[#639922]"
                : "border-white/[0.08] bg-white/[0.04] text-white/50"
            }`}
          >
            {conv.otherPartyAvatar ? (
              <img
                src={conv.otherPartyAvatar}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              getInitials(conv.otherPartyName || "?")
            )}
          </div>
          {conv.unreadCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
              rounded-full text-[10px] font-bold text-white ${unreadColor}`}
            >
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span
              className={`text-[13px] font-semibold truncate
              ${
                active
                  ? "text-white/90"
                  : "text-white/70 group-hover:text-white/85"
              }`}
            >
              {conv.otherPartyName}
            </span>
            {conv.lastMessageAt && (
              <span className="shrink-0 text-[10px] text-white/25">
                {formatDate(conv.lastMessageAt)}
              </span>
            )}
          </div>
          {conv.lastMessage && (
            <p className="text-[12px] text-white/30 truncate">
              {conv.lastMessage}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/** Loading skeleton */
function LoadingState() {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
        <p className="text-sm text-white/30">Loading conversations…</p>
      </div>
    </div>
  );
}

/** Empty state — no conversations */
function EmptyConversations() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center px-4">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl
                      border border-white/[0.07] bg-white/[0.03]"
      >
        <MessageCircle className="h-7 w-7 text-white/20" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-white/60">
        No Conversations Yet
      </h2>
      <p className="max-w-sm text-sm text-white/30 leading-relaxed">
        Once your account is verified and a university department accepts your
        connection, you'll be able to chat here.
      </p>
    </div>
  );
}

/** Empty chat panel — no conversation selected */
function NothingSelected() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-8">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl
                      border border-[#639922]/15 bg-[#639922]/[0.06]"
      >
        <MessageCircle className="h-6 w-6 text-[#639922]/60" />
      </div>
      <p className="text-sm font-medium text-white/40">Select a conversation</p>
      <p className="mt-1 text-[12px] text-white/20">
        Choose from the list on the left to start messaging
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MessagesPage = () => {
  const { profile } = useAuth();
  const {
    conversations,
    messages,
    selectedConversationId,
    loadMessages,
    sending,
    uploading,
    loadingConversations,
    loadingMessages,
    sendMessageWithFile,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [convSearch, setConvSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── File ────────────────────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10 MB.");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    e.target.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConversationId)
      return;
    await sendMessageWithFile(
      selectedConversationId,
      newMessage,
      selectedFile || undefined
    );
    setNewMessage("");
    setSelectedFile(null);
    setFilePreview(null);
    inputRef.current?.focus();
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const filteredConvs = (list: any[]) =>
    list.filter(
      (c) =>
        !convSearch ||
        c.otherPartyName?.toLowerCase().includes(convSearch.toLowerCase())
    );

  const universityConvs = filteredConvs(
    conversations.filter((c) => c.otherPartyRole === "university")
  );
  const companyConvs = filteredConvs(
    conversations.filter((c) => c.otherPartyRole === "company")
  );

  const isBusy = sending || uploading;

  // ── Guard states ────────────────────────────────────────────────────────────

  if (loadingConversations) return <LoadingState />;
    if (conversations.length === 0) return <EmptyConversations />;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-0 h-[calc(100vh-6rem)]">
      {/* ── Page heading ── */}
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
          <MessageCircle className="h-4 w-4 text-[#639922]" />
        </div>
        <h1 className="text-lg font-semibold text-white/85">Messages</h1>
        {conversations.filter((c) => c.unreadCount > 0).length > 0 && (
          <span className="rounded-full bg-[#639922] px-2 py-0.5 text-[10px] font-bold text-black">
            {conversations.reduce((a, c) => a + (c.unreadCount ?? 0), 0)}
          </span>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
        {/* ══ Sidebar ══ */}
        <div
          className={`
          ${sidebarOpen ? "flex" : "hidden md:flex"}
          w-full md:w-72 lg:w-80 shrink-0
          flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden
        `}
        >
          {/* Sidebar header */}
          <div className="shrink-0 border-b border-white/[0.05] px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-8 pr-3 py-2
                           text-[13px] text-white/70 placeholder:text-white/20
                           focus:border-[#639922]/35 focus:outline-none focus:ring-2 focus:ring-[#639922]/10
                           transition-all"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div
            className="flex-1 overflow-y-auto px-2 py-2 space-y-4
                          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          >
            {/* University — pinned */}
            {universityConvs.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 mb-1.5">
                  <Pin className="h-2.5 w-2.5 text-white/20" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
                    Pinned
                  </span>
                </div>
                <div className="space-y-0.5">
                  {universityConvs.map((conv) => (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      active={selectedConversationId === conv.id}
                      onClick={() => {
                        loadMessages(conv.id); // ✅ fetch messages
                        setSidebarOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {companyConvs.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 mb-1.5">
                  <Briefcase className="h-2.5 w-2.5 text-white/20" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
                    Companies
                  </span>
                </div>
                <div className="space-y-0.5">
                  {companyConvs.map((conv) => (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      active={selectedConversationId === conv.id}
                      onClick={() => {
                        loadMessages(conv.id);
                        setSidebarOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {universityConvs.length === 0 && companyConvs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-[12px] text-white/25">
                  No conversations match your search
                </p>
              </div>
            )}
          </div>

          {/* Sidebar footer — total count */}
          <div className="shrink-0 border-t border-white/[0.04] px-4 py-2.5">
            <p className="text-[11px] text-white/20">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ══ Chat panel ══ */}
        <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden min-w-0">
          {!selectedConversationId ? (
            <NothingSelected />
          ) : (
            <>
              {/* Chat header */}
              <div className="shrink-0 flex items-center gap-3 border-b border-white/[0.05] px-5 py-3.5 bg-white/[0.01]">
                {/* Back on mobile */}
                <button
                  className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg
                             border border-white/[0.07] bg-white/[0.04] text-white/40
                             hover:text-white/70 transition-all"
                  onClick={() => setSidebarOpen(true)}
                >
                  ←
                </button>

                {/* Avatar */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                border border-[#639922]/20 bg-[#639922]/10 text-xs font-semibold text-[#639922]"
                >
                  {currentConversation?.otherPartyAvatar ? (
                    <img
                      src={currentConversation.otherPartyAvatar}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    getInitials(currentConversation?.otherPartyName || "?")
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/85 truncate">
                    {currentConversation?.otherPartyName}
                  </p>
                  <p className="text-[11px] text-white/30">
                    {currentConversation?.otherPartyRole === "university"
                      ? "University Department"
                      : "Company"}
                  </p>
                </div>

                <button
                  className="flex h-7 w-7 items-center justify-center rounded-lg
                                   border border-white/[0.07] bg-white/[0.03] text-white/30
                                   hover:text-white/60 hover:bg-white/[0.06] transition-all"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-5 py-4">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-white/40" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-16">
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl
                                    border border-white/[0.06] bg-whi\te/[0.03]"
                    >
                      <MessageCircle className="h-5 w-5 text-white/20" />
                    </div>
                    <p className="text-sm text-white/30">No messages yet</p>
                    <p className="text-[12px] text-white/18 mt-1">
                      Send the first message to start the conversation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pb-2">
                    {messages.map((msg, i) => {
                      const isOwn = msg.sender_id === profile?.id;
                      const prevMsg = messages[i - 1];
                      const showTime =
                        !prevMsg ||
                        new Date(msg.created_at).getTime() -
                          new Date(prevMsg.created_at).getTime() >
                          5 * 60_000;

                      return (
                        <div key={msg.id}>
                          {/* Time separator */}
                          {showTime && (
                            <div className="flex items-center justify-center my-3">
                              <span
                                className="text-[10px] text-white/20 bg-white/[0.04] border border-white/[0.05]
                                              rounded-full px-3 py-1 font-medium"
                              >
                                {formatTime(msg.created_at)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex ${
                              isOwn ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`
                              group relative max-w-[72%] sm:max-w-[60%]
                              rounded-2xl px-4 py-2.5 transition-all
                              ${
                                isOwn
                                  ? "rounded-br-sm bg-[#639922] text-white"
                                  : "rounded-bl-sm bg-white/[0.06] border border-white/[0.06] text-white/80"
                              }
                            `}
                            >
                              {/* File attachment */}
                              {msg.file_url && (
                                <div className="mb-2">
                                  {msg.file_type?.startsWith("image/") ? (
                                    <a
                                      href={msg.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <img
                                        src={msg.file_url}
                                        alt={msg.file_name}
                                        className="max-h-48 rounded-lg object-cover w-full"
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      href={msg.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px]
                                        transition-all hover:opacity-80
                                        ${
                                          isOwn
                                            ? "border-white/20 bg-white/10"
                                            : "border-white/[0.08] bg-white/[0.04]"
                                        }`}
                                    >
                                      <File className="h-4 w-4 shrink-0" />
                                      <span className="truncate max-w-[180px]">
                                        {msg.file_name}
                                      </span>
                                    </a>
                                  )}
                                </div>
                              )}

                              {/* Text */}
                              {msg.content && (
                                <p className="text-[13px] leading-relaxed break-words">
                                  {msg.content}
                                </p>
                              )}

                              {/* Timestamp + read tick */}
                              <div
                                className={`flex items-center gap-1 mt-1 justify-end`}
                              >
                                <span
                                  className={`text-[10px] ${
                                    isOwn ? "text-white/60" : "text-white/25"
                                  }`}
                                >
                                  {formatTime(msg.created_at)}
                                </span>
                                {isOwn && (
                                  <CheckCheck
                                    className={`h-3 w-3 ${
                                      msg.read
                                        ? "text-white/80"
                                        : "text-white/40"
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* File preview strip */}
              {selectedFile && (
                <div className="shrink-0 border-t border-white/[0.05] px-5 py-2.5">
                  <div
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07]
                                  bg-white/[0.03] px-3 py-2"
                  >
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="preview"
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                                      border border-white/[0.07] bg-white/[0.04]"
                      >
                        <File className="h-4 w-4 text-white/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white/70 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md
                                 text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input bar */}
              <div className="shrink-0 border-t border-white/[0.05] px-4 py-3 bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,application/pdf,application/msword,.txt,.csv"
                    className="hidden"
                  />

                  {/* Attach */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    title="Attach file"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                               border border-white/[0.08] bg-white/[0.03] text-white/35
                               hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white/65
                               transition-all disabled:opacity-30"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message…"
                    disabled={isBusy}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03]
                               px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20
                               focus:border-[#639922]/35 focus:bg-[#639922]/[0.03]
                               focus:outline-none focus:ring-2 focus:ring-[#639922]/10
                               disabled:opacity-40 transition-all"
                  />

                  {/* Send */}
                  <button
                    onClick={handleSend}
                    disabled={isBusy || (!newMessage.trim() && !selectedFile)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                               border border-[#639922]/30 bg-[#639922]/15 text-[#639922]
                               hover:bg-[#639922]/25 hover:border-[#639922]/50
                               hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)]
                               transition-all duration-150
                               disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
