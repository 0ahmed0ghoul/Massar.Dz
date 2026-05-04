// StudentsPage.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Search, Send, XCircle, Database, Users, Trash2,
  Edit, Save, X, CheckCircle2, Clock, AlertCircle, FileSpreadsheet,
  ChevronRight, Loader2, UserCheck, UserX, Wifi, Info,
  GraduationCap, BarChart3,
} from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUniversityStudentConnection } from "../hooks/useUniversityStudentConnection";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabValue = "verification" | "database";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MatchBadge({ match }: { match?: any }) {
  if (!match) return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/40">
      <Info className="h-3 w-3" /> Not checked
    </span>
  );
  if (match.matched) return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
      <CheckCircle2 className="h-3 w-3" /> Perfect Match
    </span>
  );
  if (match.matchScore >= 50) return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
      <AlertCircle className="h-3 w-3" /> Partial ({match.matchScore}%)
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400">
      <XCircle className="h-3 w-3" /> Mismatch
    </span>
  );
}

function ConnectionBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; classes: string; icon: React.ElementType }> = {
    connected: { label: "Connected",     classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400", icon: Wifi },
    pending:   { label: "Invite Sent",   classes: "border-amber-500/20  bg-amber-500/10  text-amber-400",   icon: Clock },
    rejected:  { label: "Rejected",      classes: "border-red-500/20    bg-red-500/10    text-red-400",     icon: UserX },
    none:      { label: "Pending Review",classes: "border-white/10       bg-white/5       text-white/40",    icon: Clock },
  };
  const { label, classes, icon: Icon } = cfg[status] ?? cfg.none;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${classes}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{label}</p>
        <p className="text-2xl font-bold text-white/90 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-white/25 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Upload Drop Zone ─────────────────────────────────────────────────────────

function UploadZone({ uploading, fileName, onFile }: {
  uploading: boolean; fileName: string; onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && ref.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          ref.current.files = dt.files;
          ref.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }}
      onClick={() => ref.current?.click()}
      className={`
        group relative flex cursor-pointer flex-col items-center justify-center gap-3
        rounded-2xl border-2 border-dashed px-8 py-10 text-center transition-all duration-200
        ${dragging
          ? "border-[#639922]/60 bg-[#639922]/[0.06]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-[#639922]/40 hover:bg-[#639922]/[0.03]"
        }
      `}
    >
      <input ref={ref} type="file" accept=".xlsx,.xls" onChange={onFile} className="hidden" />
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200
        ${dragging ? "border-[#639922]/40 bg-[#639922]/15" : "border-white/10 bg-white/[0.04] group-hover:border-[#639922]/30 group-hover:bg-[#639922]/10"}`}>
        {uploading ? (
          <Loader2 className="h-6 w-6 text-[#639922] animate-spin" />
        ) : (
          <FileSpreadsheet className={`h-6 w-6 transition-colors ${dragging ? "text-[#639922]" : "text-white/30 group-hover:text-[#639922]"}`} />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/70 group-hover:text-white/90 transition-colors">
          {uploading ? "Processing file…" : fileName || "Click to upload or drag & drop"}
        </p>
        <p className="text-[11px] text-white/30 mt-1">Supports .xlsx and .xls — matches columns: id_card, full name, speciality type, academic year, group, section</p>
      </div>
      {fileName && !uploading && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#639922]/25 bg-[#639922]/10 px-3 py-1 text-[11px] font-medium text-[#639922]">
          <FileSpreadsheet className="h-3 w-3" /> {fileName}
        </span>
      )}
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon: Icon, label, count }: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150
        ${active
          ? "bg-[#639922]/15 text-[#639922] border border-[#639922]/25"
          : "text-white/40 border border-transparent hover:text-white/70 hover:bg-white/[0.04]"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && (
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none
          ${active ? "bg-[#639922]/20 text-[#639922]" : "bg-white/10 text-white/40"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentsPage() {
  const { profile } = useAuth();
  const universityId = profile?.id;

  const {
    officialStudents,
    registeredStudents,
    matchResults,
    loading,
    uploading,
    previewUpload,
    confirmUpload,
    acceptStudent,
    rejectStudent,
  } = useUniversityStudentConnection(universityId);

  const [activeTab, setActiveTab]             = useState<TabValue>("verification");
  const [searchQuery, setSearchQuery]         = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason]       = useState("");
  const [currentStudent, setCurrentStudent]   = useState<any>(null);
  const [previewOpen, setPreviewOpen]         = useState(false);
  const [previewData, setPreviewData]         = useState<any[]>([]);
  const [editingRow, setEditingRow]           = useState<number | null>(null);
  const [editForm, setEditForm]               = useState<any>({});
  const [importing, setImporting]             = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    if (!file.name.match(/\.xlsx?$/)) { alert("Please upload an Excel file (.xlsx or .xls)"); return; }
    try {
      const data = await previewUpload(file);
      setPreviewData(data);
      setPreviewOpen(true);
    } catch { alert("Failed to read file"); }
    e.target.value = "";
  };

  const deleteRow  = (i: number)  => setPreviewData(p => p.filter((_, idx) => idx !== i));
  const startEdit  = (i: number)  => { setEditingRow(i); setEditForm({ ...previewData[i] }); };
  const saveEdit   = (i: number)  => { const u = [...previewData]; u[i] = { ...editForm }; setPreviewData(u); setEditingRow(null); };
  const cancelEdit = ()           => { setEditingRow(null); setEditForm({}); };
  const fieldChange= (k: string, v: string) => setEditForm((p: any) => ({ ...p, [k]: v }));

  const confirmImport = async () => {
    if (!previewData.length || importing) return;
    setImporting(true);
    try { await confirmUpload(previewData); setPreviewOpen(false); setPreviewData([]); setSelectedFileName(""); }
    catch { /* toasted by hook */ }
    finally { setImporting(false); }
  };

  // ── Accept / Reject ────────────────────────────────────────────────────────

  const handleAccept     = async (s: any) => { const m = matchResults.get(s.id); if (m) await acceptStudent(s, m); };
  const openRejectDialog = (s: any)       => { setCurrentStudent(s); setRejectReason(""); setRejectDialogOpen(true); };
  const confirmReject    = async ()       => {
    if (currentStudent && rejectReason.trim()) {
      await rejectStudent(currentStudent, rejectReason);
      setRejectDialogOpen(false); setCurrentStudent(null); setRejectReason("");
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const filteredRegistered = registeredStudents.filter(s =>
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedCount  = registeredStudents.filter(s => s.connection_status === "connected").length;
  const pendingCount    = registeredStudents.filter(s => s.connection_status === "none").length;
  const matchedCount    = [...matchResults.values()].filter(m => m?.matched).length;

  // ── Preview columns ────────────────────────────────────────────────────────

  const PREVIEW_COLS = [
    { key: "student_id",     label: "Student ID" },
    { key: "first_name",     label: "First Name" },
    { key: "last_name",      label: "Last Name" },
    { key: "speciality",     label: "Speciality" },
    { key: "speciality_type",label: "Type" },
    { key: "academic_year",  label: "Year" },
  ] as const;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#639922]">University Admin</span>
            </div>
            <h1 className="text-3xl font-bold text-white/90 tracking-tight">Student Management</h1>
            <p className="mt-1.5 text-sm text-white/35 max-w-xl">
              Upload your official student roster, then review and verify connection requests from registered students.
            </p>
          </div>

          {/* Upload zone — compact in header on desktop */}
          <div className="shrink-0 sm:w-72">
            <UploadZone
              uploading={uploading}
              fileName={selectedFileName}
              onFile={handleFileSelect}
            />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Database}     label="Roster Size"  value={officialStudents.length}   color="border-indigo-500/20 bg-indigo-500/10 text-indigo-400" />
          <StatCard icon={Users}        label="Registered"   value={registeredStudents.length}  color="border-sky-500/20 bg-sky-500/10 text-sky-400" />
          <StatCard icon={GraduationCap} label="Connected"   value={connectedCount}             color="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" />
          <StatCard icon={BarChart3}    label="Matched"      value={matchedCount}  sub="auto-detected" color="border-[#639922]/20 bg-[#639922]/10 text-[#639922]" />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2">
          <TabBtn active={activeTab === "verification"} onClick={() => setActiveTab("verification")}
            icon={Users} label="Verification & Invitations" count={pendingCount} />
          <TabBtn active={activeTab === "database"} onClick={() => setActiveTab("database")}
            icon={Database} label="Official Roster" count={officialStudents.length} />
        </div>

        {/* ══════ VERIFICATION TAB ══════ */}
        {activeTab === "verification" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
              <input
                type="text"
                placeholder="Search by Student ID, name, or email…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-10 pr-10 py-2.5 text-sm
                           text-white/80 placeholder:text-white/25 focus:border-[#639922]/40 focus:bg-[#639922]/[0.03]
                           focus:outline-none focus:ring-[3px] focus:ring-[#639922]/10 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center
                             rounded-md text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Table card */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4 bg-white/[0.02]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#639922]/10 border border-[#639922]/20">
                  <Users className="h-4 w-4 text-[#639922]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Registered Students</p>
                  <p className="text-[11px] text-white/30">Students who completed their profile and requested department connection</p>
                </div>
                <span className="ml-auto text-[11px] text-white/25 font-mono">{filteredRegistered.length} results</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {["Student", "Email", "Speciality", "Type", "Match", "Missing", "Connection", "Actions"].map((col, i) => (
                        <th key={i} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25 bg-white/[0.015]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
                            <span className="text-sm text-white/30">Loading students…</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRegistered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                              <Users className="h-5 w-5 text-white/20" />
                            </div>
                            <p className="text-sm text-white/30">No students found</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRegistered.map(student => {
                      const match = matchResults.get(student.id);
                      return (
                        <tr key={student.id} className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors">
                          {/* Student */}
                          <td className="px-5 py-3.5">
                            <div>
                              <p className="font-semibold text-white/85">{student.first_name} {student.last_name}</p>
                              <p className="text-[11px] font-mono text-white/30 mt-0.5">{student.student_id}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[12px] text-white/45">{student.email}</td>
                          <td className="px-5 py-3.5 text-[12px] text-white/60">{student.speciality}</td>
                          <td className="px-5 py-3.5 text-[12px] text-white/50">{student.speciality_type}</td>
                          <td className="px-5 py-3.5"><MatchBadge match={match} /></td>
                          <td className="px-5 py-3.5">
                            {match && !match.matched && (
                              <span className="text-[11px] text-red-400/70 font-medium">
                                {match.mismatchedFields?.join(", ")}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <ConnectionBadge status={student.connection_status} />
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              {match?.matched && student.connection_status === "none" && (
                                <button
                                  onClick={() => handleAccept(student)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#639922]/30
                                             bg-[#639922]/10 px-3 py-1.5 text-[11px] font-semibold text-[#639922]
                                             hover:bg-[#639922]/20 hover:border-[#639922]/50 transition-all"
                                >
                                  <Send className="h-3 w-3" /> Accept
                                </button>
                              )}
                              {!match?.matched && student.connection_status === "none" && (
                                <button
                                  onClick={() => openRejectDialog(student)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20
                                             bg-red-500/5 px-3 py-1.5 text-[11px] font-semibold text-red-400
                                             hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                >
                                  <XCircle className="h-3 w-3" /> Reject
                                </button>
                              )}
                              {student.connection_status === "rejected" && student.rejection_reason && (
                                <span className="text-[11px] text-white/25 italic max-w-[160px] truncate" title={student.rejection_reason}>
                                  {student.rejection_reason}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer count */}
              {filteredRegistered.length > 0 && (
                <div className="border-t border-white/[0.04] px-6 py-3">
                  <p className="text-[11px] text-white/20">{filteredRegistered.length} student{filteredRegistered.length !== 1 ? "s" : ""}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ DATABASE TAB ══════ */}
        {activeTab === "database" && (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4 bg-white/[0.02]">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Database className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">Official University Roster</p>
                <p className="text-[11px] text-white/30">Imported from your XLSX file — used as the reference for student verification</p>
              </div>
              <span className="ml-auto text-[11px] text-white/25 font-mono">{officialStudents.length} records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["ID Card", "Full Name", "Speciality", "Type", "Year", "Group", "Section"].map((col, i) => (
                      <th key={i} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25 bg-white/[0.015]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {officialStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02]">
                            <FileSpreadsheet className="h-7 w-7 text-white/20" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/40">No roster uploaded yet</p>
                            <p className="text-[11px] text-white/20 mt-1">Use the upload area above to import your official XLSX file</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : officialStudents.map((s, i) => (
                    <tr key={s.id ?? i} className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[12px] text-white/50">{s.student_id}</td>
                      <td className="px-5 py-3.5 font-medium text-white/80">{s.first_name} {s.last_name}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/55">{s.speciality}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/45">{s.speciality_type}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/55">{s.academic_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {officialStudents.length > 0 && (
              <div className="border-t border-white/[0.04] px-6 py-3">
                <p className="text-[11px] text-white/20">{officialStudents.length} record{officialStudents.length !== 1 ? "s" : ""} imported</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════ REJECTION DIALOG ══════ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="border-white/[0.09] bg-[#0f1117] max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 mb-3">
              <UserX className="h-5 w-5 text-red-400" />
            </div>
            <DialogTitle className="text-white/90">Reject Connection Request</DialogTitle>
            <DialogDescription className="text-white/40 text-[13px]">
              Write a clear reason. The student will receive this via email and can update their profile and re-apply.
            </DialogDescription>
          </DialogHeader>

          {currentStudent && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.07]">
                <GraduationCap className="h-4 w-4 text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{currentStudent.first_name} {currentStudent.last_name}</p>
                <p className="text-[11px] text-white/35">{currentStudent.email}</p>
              </div>
            </div>
          )}

          <Textarea
            placeholder="e.g. Your student ID doesn't match our records. Please verify your ID card number and resubmit."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className="min-h-[110px] resize-none bg-white/[0.03] border-white/[0.08] text-white/80
                       placeholder:text-white/20 focus:border-red-500/30 focus:ring-red-500/10 text-sm"
          />

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}
              className="border-white/10 text-white/50 hover:text-white/80">
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
              className="bg-red-500/90 hover:bg-red-500 text-white border-0 disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════ PREVIEW & EDIT MODAL ══════ */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col border-white/[0.09] bg-[#0f1117] p-0 gap-0">
          {/* Header */}
          <div className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10 shrink-0">
              <FileSpreadsheet className="h-5 w-5 text-[#639922]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white/90">Review & Edit Import</h2>
              <p className="text-[12px] text-white/35 mt-0.5">
                Edit or remove rows before confirming. Duplicate student IDs will be updated, not duplicated.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#639922]/20 bg-[#639922]/10 px-3 py-1 text-[11px] font-semibold text-[#639922]">
              {previewData.length} rows
            </span>
          </div>

          {/* Scrollable table */}
          <div className="overflow-auto flex-1">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-white/[0.07] bg-[#0f1117]">
                  <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/25 w-8">
                    #
                  </th>
                  {PREVIEW_COLS.map(c => (
                    <th key={c.key} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/25">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-white/25 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className={`border-b border-white/[0.04] transition-colors ${editingRow === idx ? "bg-[#639922]/[0.04]" : "hover:bg-white/[0.02]"}`}>
                    <td className="px-2 py-2.5 text-[11px] text-white/20 font-mono">{idx + 1}</td>
                    {editingRow === idx ? (
                      <>
                        {PREVIEW_COLS.map(c => (
                          <td key={c.key} className="px-2 py-1.5">
                            <input
                              value={editForm[c.key] ?? ""}
                              onChange={e => fieldChange(c.key, e.target.value)}
                              className="w-full rounded-lg border border-[#639922]/30 bg-[#639922]/[0.06]
                                         px-2.5 py-1.5 text-[12px] text-white/80
                                         focus:border-[#639922]/50 focus:outline-none transition-all"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => saveEdit(idx)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#639922]/15 border border-[#639922]/25 text-[#639922] hover:bg-[#639922]/25 transition-all">
                              <Save className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={cancelEdit}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70 transition-all">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {PREVIEW_COLS.map(c => (
                          <td key={c.key} className={`px-3 py-2.5 ${c.key === "student_id" ? "font-mono text-[12px] text-white/50" : "text-[12px] text-white/65"}`}>
                            {row[c.key]}
                          </td>
                        ))}
                        <td className="px-3 py-2.5 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => startEdit(idx)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all">
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => deleteRow(idx)} disabled={importing}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-30">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4 bg-white/[0.01]">
            <p className="text-[11px] text-white/25">
              {previewData.length} row{previewData.length !== 1 ? "s" : ""} ready to import
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)} disabled={importing}
                className="border-white/10 text-white/50 hover:text-white/80 text-sm">
                Cancel
              </Button>
              <Button
                onClick={confirmImport}
                disabled={previewData.length === 0 || importing}
                className="bg-[#639922] hover:bg-[#7fb82c] text-black font-semibold text-sm
                           disabled:opacity-30 hover:shadow-[0_4px_14px_rgba(99,153,34,0.35)] transition-all"
              >
                {importing ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Importing…</>
                ) : (
                  <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Confirm Import ({previewData.length})</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}