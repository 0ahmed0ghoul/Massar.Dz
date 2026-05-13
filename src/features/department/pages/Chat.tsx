// pages/university/dashboard/chat.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useChat } from '@/features/department/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send, MessageCircle, Users, Paperclip, File,
  Image as ImageIcon, X, Search, GraduationCap,
  Loader2, CheckCheck, MoreVertical, ChevronLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelative(ts: string) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return ''; }
}

function formatSidebarDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return formatTime(ts);
  const diff = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const showTimeSeparator = (cur: string, prev?: string) =>
  !prev || new Date(cur).getTime() - new Date(prev).getTime() > 5 * 60_000;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StudentItem({
  student,
  active,
  onClick,
}: {
  student: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left rounded-xl px-3 py-3 transition-all duration-150
        ${active
          ? 'bg-[#639922]/10 border border-[#639922]/20'
          : 'border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`
            flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold
            ${active
              ? 'border border-[#639922]/30 bg-[#639922]/15 text-[#639922]'
              : 'border border-white/[0.08] bg-white/[0.04] text-white/50 group-hover:border-white/[0.12]'
            }
          `}>
            {student.avatar_url
              ? <img src={student.avatar_url} className="h-full w-full rounded-xl object-cover" alt="" />
              : getInitials(student.full_name)
            }
          </div>
          {student.unread_count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                             rounded-full bg-[#639922] text-[10px] font-bold text-black">
              {student.unread_count > 9 ? '9+' : student.unread_count}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className={`text-[13px] font-semibold truncate transition-colors
              ${active ? 'text-white/90' : 'text-white/65 group-hover:text-white/80'}`}>
              {student.full_name}
            </span>
            {student.last_message_at && (
              <span className="shrink-0 text-[10px] text-white/20">
                {formatSidebarDate(student.last_message_at)}
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-white/25 truncate">
            {student.student_id}
          </p>
          {student.last_message && (
            <p className="text-[11px] text-white/25 truncate mt-0.5">
              {student.last_message.slice(0, 45)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function NothingSelected() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-8 gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl
                      border border-[#639922]/15 bg-[#639922]/[0.06]">
        <MessageCircle className="h-6 w-6 text-[#639922]/50" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/40">No conversation selected</p>
        <p className="mt-1 text-[12px] text-white/20">
          Choose a student from the list to start messaging
        </p>
      </div>
    </div>
  );
}

function EmptyMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl
                      border border-white/[0.06] bg-white/[0.03]">
        <MessageCircle className="h-5 w-5 text-white/20" />
      </div>
      <div>
        <p className="text-sm text-white/30">No messages yet</p>
        <p className="text-[12px] text-white/18 mt-1">Send the first message</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UniversityChatPage() {
  const { profile } = useAuth();
  const adminId = profile?.id;

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [messageInput, setMessageInput]           = useState('');
  const [selectedFile, setSelectedFile]           = useState<File | null>(null);
  const [filePreview, setFilePreview]             = useState<string | null>(null);
  const [search, setSearch]                       = useState('');
  const [sidebarOpen, setSidebarOpen]             = useState(true);

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  const { students, messages, loading, sending, uploading, sendMessageWithFile } =
    useChat(adminId, selectedStudentId || undefined);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const isBusy = sending || uploading;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!messageInput.trim() && !selectedFile) return;
    await sendMessageWithFile(messageInput, selectedFile || undefined);
    setMessageInput('');
    setSelectedFile(null);
    setFilePreview(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File too large. Max 10 MB.'); return; }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    e.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Derived ───────────────────────────────────────────────────────────────────

  const filteredStudents = students.filter(s =>
    !search ||
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = students.reduce((a, s) => a + (s.unread_count ?? 0), 0);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none fixed -top-48 left-1/2 h-[500px] w-[700px]
                      -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72
                      rounded-full bg-[#639922]/[0.04] blur-[90px] translate-x-1/3 translate-y-1/3" />
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-[#639922]/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8
                      flex flex-col h-screen gap-5">

        {/* ── Page header ── */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl
                            border border-[#639922]/20 bg-[#639922]/10">
              <MessageCircle className="h-4 w-4 text-[#639922]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white/85">Messages</h1>
                {totalUnread > 0 && (
                  <span className="rounded-full bg-[#639922] px-2 py-0.5 text-[10px] font-bold text-black">
                    {totalUnread}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-white/30">Chat with connected students</p>
            </div>
          </div>
        </header>

        {/* ── Two-column layout ── */}
        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden pb-4">

          {/* ══ Sidebar ══ */}
          <div className={`
            ${sidebarOpen ? 'flex' : 'hidden md:flex'}
            w-full md:w-72 lg:w-80 shrink-0
            flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden
          `}>

            {/* Sidebar header */}
            <div className="shrink-0 border-b border-white/[0.05] px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#639922]" />
                  <span className="text-sm font-semibold text-white/70">Students</span>
                </div>
                <span className="text-[11px] font-mono text-white/25">
                  {students.length} connected
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25" />
                <input
                  type="text"
                  placeholder="Search students…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03]
                             pl-8 pr-3 py-2 text-[13px] text-white/70 placeholder:text-white/20
                             focus:border-[#639922]/35 focus:outline-none focus:ring-2 focus:ring-[#639922]/10
                             transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Student list */}
            <div className="flex-1 overflow-y-auto px-2 py-2
                            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-[#639922]" />
                  <span className="text-[12px] text-white/30">Loading students…</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                  <GraduationCap className="h-8 w-8 text-white/15" />
                  <p className="text-[12px] text-white/25">
                    {search ? 'No students match your search' : 'No connected students yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredStudents.map(student => (
                    <StudentItem
                      key={student.id}
                      student={student}
                      active={selectedStudentId === student.id}
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setSidebarOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/[0.04] px-4 py-2.5">
              <p className="text-[11px] text-white/20">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                {search ? ' found' : ' connected'}
              </p>
            </div>
          </div>

          {/* ══ Chat panel ══ */}
          <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.07]
                          bg-white/[0.02] overflow-hidden min-w-0">

            {!selectedStudent ? (
              <NothingSelected />
            ) : (
              <>
                {/* Chat header */}
                <div className="shrink-0 flex items-center gap-3 border-b border-white/[0.05]
                                px-5 py-3.5 bg-white/[0.01]">
                  {/* Back on mobile */}
                  <button
                    className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg
                               border border-white/[0.07] bg-white/[0.04] text-white/40
                               hover:text-white/70 transition-all"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                  border border-[#639922]/20 bg-[#639922]/10 text-xs font-semibold text-[#639922]">
                    {selectedStudent.avatar_url
                      ? <img src={selectedStudent.avatar_url} className="h-full w-full rounded-xl object-cover" alt="" />
                      : getInitials(selectedStudent.full_name)
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/85 truncate">
                      {selectedStudent.full_name}
                    </p>
                    <p className="text-[11px] font-mono text-white/30">
                      {selectedStudent.student_id}
                    </p>
                  </div>

                  <button className="flex h-7 w-7 items-center justify-center rounded-lg
                                     border border-white/[0.07] bg-white/[0.03] text-white/30
                                     hover:text-white/60 hover:bg-white/[0.06] transition-all">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-5 py-4">
                  {messages.length === 0 ? (
                    <EmptyMessages />
                  ) : (
                    <div className="space-y-2 pb-2">
                      {messages.map((msg, i) => {
                        const isAdmin = msg.sender_id === adminId;
                        const prev    = messages[i - 1];

                        return (
                          <div key={msg.id}>
                            {/* Time separator */}
                            {showTimeSeparator(msg.created_at, prev?.created_at) && (
                              <div className="flex items-center justify-center my-4">
                                <span className="text-[10px] text-white/20 bg-white/[0.04]
                                                border border-white/[0.05] rounded-full px-3 py-1">
                                  {formatRelative(msg.created_at)}
                                </span>
                              </div>
                            )}

                            <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                              <div className={`
                                max-w-[70%] sm:max-w-[60%] rounded-2xl px-4 py-2.5
                                ${isAdmin
                                  ? 'rounded-br-sm bg-[#639922] text-white'
                                  : 'rounded-bl-sm bg-white/[0.06] border border-white/[0.06] text-white/80'
                                }
                              `}>

                                {/* File attachment */}
                                {msg.file_url && (
                                  <div className="mb-2">
                                    {msg.file_type?.startsWith('image/') ? (
                                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
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
                                          hover:opacity-80 transition-all
                                          ${isAdmin
                                            ? 'border-white/20 bg-white/10'
                                            : 'border-white/[0.08] bg-white/[0.04]'
                                          }`}
                                      >
                                        <File className="h-4 w-4 shrink-0" />
                                        <span className="truncate max-w-[160px]">{msg.file_name}</span>
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

                                {/* Timestamp + read */}
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                  <span className={`text-[10px] ${isAdmin ? 'text-white/60' : 'text-white/25'}`}>
                                    {formatTime(msg.created_at)}
                                  </span>
                                  {isAdmin && (
                                    <CheckCheck className={`h-3 w-3 ${msg.read ? 'text-white/80' : 'text-white/35'}`} />
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
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07]
                                    bg-white/[0.03] px-3 py-2">
                      {filePreview ? (
                        <img src={filePreview} alt="preview"
                          className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                                        border border-white/[0.07] bg-white/[0.04]">
                          <File className="h-4 w-4 text-white/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-white/70 truncate">{selectedFile.name}</p>
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

                    {/* Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      disabled={isBusy}
                      className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03]
                                 px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20
                                 focus:border-[#639922]/35 focus:bg-[#639922]/[0.03]
                                 focus:outline-none focus:ring-2 focus:ring-[#639922]/10
                                 disabled:opacity-40 transition-all"
                    />

                    {/* Send */}
                    <button
                      onClick={handleSend}
                      disabled={isBusy || (!messageInput.trim() && !selectedFile)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                 border border-[#639922]/30 bg-[#639922]/15 text-[#639922]
                                 hover:bg-[#639922]/25 hover:border-[#639922]/50
                                 hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)]
                                 transition-all duration-150
                                 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isBusy
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Send className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}