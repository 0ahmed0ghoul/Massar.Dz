// pages/university/dashboard/CertificateRequests.tsx
import { useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Eye, FileText, Star, GraduationCap, CheckCircle2,
  XCircle, Upload, Loader2, Calendar, User, Hash,
  Clock, Award, ExternalLink, ShieldCheck, AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { useUniversityCertificateRequests } from '../../university/hooks/useUniversityCertificateRequests';

// ─── Types ────────────────────────────────────────────────────────────────────
type CertRequest = any; // replace with your actual type

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const cfg = type === 'major'
    ? { icon: GraduationCap, label: 'Major',  classes: 'border-sky-500/20 bg-sky-500/10 text-sky-400' }
    : { icon: Star,          label: 'Stars',  classes: 'border-amber-500/20 bg-amber-500/10 text-amber-400' };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${cfg.classes}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">{label}</p>
        <p className="text-2xl font-bold text-white/90 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] mt-0.5">
        <Icon className="h-3.5 w-3.5 text-white/35" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-white/75">{value}</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CertificateRequestsPage() {
  const { profile } = useAuth();
  const universityId = profile?.id;
  const { requests, loading, approving, approveRequest, rejectRequest } =
    useUniversityCertificateRequests(universityId);

  const [selectedRequest, setSelectedRequest] = useState<CertRequest | null>(null);
  const [showDetail,   setShowDetail]   = useState(false);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showReject,   setShowReject]   = useState(false);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [proofPreviewType, setProofPreviewType] = useState<'image' | 'pdf' | null>(null);

  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [customTitle,     setCustomTitle]     = useState('');
  const [customIssuer,    setCustomIssuer]    = useState('');
  const [customIssueDate, setCustomIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [rejectReason,    setRejectReason]    = useState('');
  const [dragOver,        setDragOver]        = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openDetail = (req: CertRequest) => {
    setSelectedRequest(req);
    setShowDetail(true);
  };

  const openUploadModal = () => {
    if (selectedRequest) {
      setCustomTitle(selectedRequest.title ?? '');
      setCustomIssuer(selectedRequest.issuer ?? '');
      setCustomIssueDate(selectedRequest.issue_date ?? new Date().toISOString().split('T')[0]);
    }
    setShowUpload(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest || !certificateFile) return;
    await approveRequest(selectedRequest, certificateFile, {
      title: customTitle,
      issuer: customIssuer,
      issue_date: customIssueDate,
    });
    setShowUpload(false);
    setShowDetail(false);
    setCertificateFile(null);
  };
  
  const handleReject = async () => {
    if (!selectedRequest) return;
    await rejectRequest(selectedRequest, rejectReason);
    setShowReject(false);
    setShowDetail(false);
    setRejectReason('');
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/')))
      setCertificateFile(file);
  };

  const openProofPreview = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    const isPdf = ext === 'pdf';
    if (isImage) {
      setProofPreviewType('image');
      setProofPreviewUrl(url);
    } else if (isPdf) {
      setProofPreviewType('pdf');
      setProofPreviewUrl(url);
    } else {
      // fallback: open in new tab if unknown
      window.open(url, '_blank');
    }
  };

  const closeProofPreview = () => {
    setProofPreviewUrl(null);
    setProofPreviewType(null);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const starsCount = requests.filter(r => r.type === 'stars').length;
  const majorCount = requests.filter(r => r.type === 'major').length;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      {/* Background (unchanged) */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none fixed -top-48 left-1/2 h-[500px] w-[700px] -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72 rounded-full bg-[#639922]/[0.04] blur-[90px] translate-x-1/3 translate-y-1/3" />
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#639922]/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <header className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#639922]/20 bg-[#639922]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#639922]">
              <ShieldCheck className="h-3 w-3" />
              University Admin
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Certificate Requests</h1>
          <p className="text-sm text-white/35">
            Review student submissions, verify achievements, and issue official certificates.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard icon={Clock}        label="Pending"  value={requests.length} color="border-amber-500/20 bg-amber-500/10 text-amber-400" />
          <StatCard icon={Star}         label="Stars"    value={starsCount}      color="border-amber-500/20 bg-amber-500/10 text-amber-400" />
          <StatCard icon={GraduationCap} label="Major"   value={majorCount}      color="border-sky-500/20 bg-sky-500/10 text-sky-400" />
        </div>

        {/* Table card */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/[0.05] px-6 py-4 bg-white/[0.01]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
              <Award className="h-4 w-4 text-[#639922]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">Pending Requests</p>
              <p className="text-[11px] text-white/30">Students awaiting certificate verification and issuance</p>
            </div>
            <span className="ml-auto text-[11px] font-mono text-white/25">{requests.length} pending</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
              <p className="text-sm text-white/30">Loading requests…</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <Award className="h-6 w-6 text-white/20" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/40">No pending requests</p>
                <p className="text-[12px] text-white/20 mt-1">Certificate requests from connected students will appear here</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['Student', 'Type', 'Requested', 'Actions'].map((col, i) => (
                      <th key={i} className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-widest
                        text-white/25 bg-white/[0.015] ${i === 3 ? 'text-right' : 'text-left'}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: CertRequest) => (
                    <tr key={req.id}
                      className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
                                          border border-white/[0.08] bg-white/[0.04] text-[11px] font-semibold text-white/50">
                            {req.student?.first_name?.[0]}{req.student?.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-white/85">
                              {req.student?.first_name} {req.student?.last_name}
                            </p>
                            <p className="text-[11px] font-mono text-white/30 mt-0.5">
                              {req.student?.student_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><TypeBadge type={req.type} /></td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] text-white/40">{formatDate(req.created_at)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDetail(req)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#639922]/25
                                     bg-[#639922]/10 px-3 py-1.5 text-[11px] font-semibold text-[#639922]
                                     hover:bg-[#639922]/20 hover:border-[#639922]/40
                                     transition-all duration-150"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-white/[0.04] px-6 py-3">
                <p className="text-[11px] text-white/20">{requests.length} request{requests.length !== 1 ? 's' : ''} pending</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DETAIL MODAL (unchanged except proof links become buttons)
      ══════════════════════════════════════════════════ */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-xl border-white/[0.09] bg-[#0f1117] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5 bg-white/[0.01]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10 shrink-0">
              <Award className="h-5 w-5 text-[#639922]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white/90">Certificate Request</h2>
              <p className="text-[12px] text-white/35 mt-0.5">Review student details before approving or rejecting</p>
            </div>
            {selectedRequest && <TypeBadge type={selectedRequest.type} />}
          </div>

          {selectedRequest && (
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto
                            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={User} label="Student" value={<div><p>{selectedRequest.student?.first_name} {selectedRequest.student?.last_name}</p><p className="text-[11px] text-white/35 font-normal mt-0.5">{selectedRequest.student?.email}</p></div>} />
                <InfoRow icon={Hash} label="Student ID" value={<span className="font-mono">{selectedRequest.student?.student_id ?? '—'}</span>} />
                <InfoRow icon={Calendar} label="Requested On" value={formatDateTime(selectedRequest.created_at)} />
                <InfoRow icon={Award} label="Certificate Type" value={<TypeBadge type={selectedRequest.type} />} />
              </div>

              {selectedRequest.type === 'stars' && selectedRequest.achievements?.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-3">Achievements & Proofs</p>
                  <div className="space-y-2">
                    {selectedRequest.achievements.map((ach: string) => (
                      <div key={ach}
                        className="flex items-center justify-between rounded-xl border border-white/[0.07]
                                   bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="text-[13px] font-medium text-white/75 capitalize">
                            {ach.replace('_', ' ')}
                          </span>
                        </div>
                        {selectedRequest.proof_urls?.[ach] ? (
                          <button
                            onClick={() => openProofPreview(selectedRequest.proof_urls[ach])}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#639922]/20
                                       bg-[#639922]/8 px-2.5 py-1 text-[11px] font-medium text-[#639922]
                                       hover:bg-[#639922]/15 transition-all"
                          >
                            <FileText className="h-3 w-3" />
                            View Proof
                          </button>
                        ) : (
                          <span className="text-[11px] text-white/20 italic">No proof attached</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4 bg-white/[0.01]">
            <button onClick={() => { setShowDetail(false); setSelectedRequest(null); }}
              className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
              Close
            </button>
            <div className="flex gap-2">
              <button onClick={() => setShowReject(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-[13px] font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button onClick={openUploadModal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#639922]/30 bg-[#639922]/12 px-4 py-2 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/22 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.2)] transition-all">
                <CheckCircle2 className="h-4 w-4" />
                Approve & Issue
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          UPLOAD / ISSUE MODAL (unchanged)
      ══════════════════════════════════════════════════ */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md border-white/[0.09] bg-[#0f1117] p-0 gap-0">
          <div className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 shrink-0">
              <Upload className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white/90">Issue Certificate</h2>
              <p className="text-[12px] text-white/35 mt-0.5">Upload the signed certificate file and confirm details</p>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-2">Certificate File <span className="text-red-400">*</span></p>
              {certificateFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 shrink-0"><FileText className="h-4 w-4 text-emerald-400" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-white/80 truncate">{certificateFile.name}</p><p className="text-[11px] text-white/30">{(certificateFile.size / 1024).toFixed(1)} KB</p></div>
                  <button onClick={() => setCertificateFile(null)} className="text-white/30 hover:text-white/60 transition-colors"><XCircle className="h-4 w-4" /></button>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('cert-file-input')?.click()}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${dragOver ? 'border-[#639922]/60 bg-[#639922]/[0.06]' : 'border-white/[0.08] bg-white/[0.02] hover:border-[#639922]/35 hover:bg-[#639922]/[0.03]'}`}
                >
                  <Upload className={`h-6 w-6 transition-colors ${dragOver ? 'text-[#639922]' : 'text-white/25'}`} />
                  <div><p className="text-[13px] font-medium text-white/55">Click to upload or drag & drop</p><p className="text-[11px] text-white/25 mt-0.5">PDF or image — max 10 MB</p></div>
                </div>
              )}
              <input id="cert-file-input" type="file" accept=".pdf,image/*" className="hidden" onChange={e => setCertificateFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Certificate Title', placeholder: 'e.g., Stars Certificate – University of Algiers', value: customTitle, set: setCustomTitle },
                { label: 'Issuer', placeholder: 'University name', value: customIssuer, set: setCustomIssuer },
              ].map(({ label, placeholder, value, set }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1.5">{label}</p>
                  <input type="text" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:border-[#639922]/40 focus:outline-none focus:ring-2 focus:ring-[#639922]/10 transition-all" />
                </div>
              ))}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1.5">Issue Date</p>
                <input type="date" value={customIssueDate} onChange={e => setCustomIssueDate(e.target.value)} className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/80 focus:border-[#639922]/40 focus:outline-none focus:ring-2 focus:ring-[#639922]/10 transition-all" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-white/[0.07] px-6 py-4">
            <button onClick={() => setShowUpload(false)} className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/45 hover:text-white/70 hover:border-white/[0.14] transition-all">Cancel</button>
            <button onClick={handleApprove} disabled={!certificateFile || approving} className="inline-flex items-center gap-2 rounded-xl border border-[#639922]/30 bg-[#639922]/15 px-4 py-2 text-[13px] font-semibold text-[#639922] hover:bg-[#639922]/25 hover:border-[#639922]/50 hover:shadow-[0_4px_14px_rgba(99,153,34,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none">
              {approving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Issuing…</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Issue Certificate</>}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          REJECT MODAL (unchanged)
      ══════════════════════════════════════════════════ */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-md border-white/[0.09] bg-[#0f1117] p-0 gap-0">
          <div className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 shrink-0"><AlertTriangle className="h-5 w-5 text-red-400" /></div>
            <div><h2 className="text-base font-semibold text-white/90">Reject Request</h2><p className="text-[12px] text-white/35 mt-0.5">The student will be notified with your reason and can resubmit.</p></div>
          </div>
          {selectedRequest && (
            <div className="px-6 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[11px] font-semibold text-white/50 shrink-0">{selectedRequest.student?.first_name?.[0]}{selectedRequest.student?.last_name?.[0]}</div>
                <div><p className="text-[13px] font-semibold text-white/80">{selectedRequest.student?.first_name} {selectedRequest.student?.last_name}</p><p className="text-[11px] text-white/35">{selectedRequest.student?.email}</p></div>
              </div>
            </div>
          )}
          <div className="px-6 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-2">Reason</p>
            <Textarea placeholder="Explain why this request is being rejected. Be specific so the student can correct their submission…" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="min-h-[110px] resize-none bg-white/[0.03] border-white/[0.08] text-white/80 placeholder:text-white/20 text-sm focus:border-red-500/30 focus:ring-red-500/10" />
          </div>
          <div className="flex justify-end gap-2 border-t border-white/[0.07] px-6 py-4">
            <button onClick={() => setShowReject(false)} className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/45 hover:text-white/70 hover:border-white/[0.14] transition-all">Cancel</button>
            <button onClick={handleReject} disabled={!rejectReason.trim()} className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-[13px] font-semibold text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"><XCircle className="h-3.5 w-3.5" />Confirm Rejection</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          PROOF PREVIEW MODAL (new)
      ══════════════════════════════════════════════════ */}
      <Dialog open={!!proofPreviewUrl} onOpenChange={() => closeProofPreview()}>
        <DialogContent className="max-w-4xl border-white/[0.09] bg-[#0f1117] p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#639922]" />
              <h3 className="text-sm font-semibold text-white/90">Proof Document</h3>
            </div>
            <button onClick={closeProofPreview} className="text-white/30 hover:text-white/60 transition-colors">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 bg-black/40 overflow-auto max-h-[70vh] flex items-center justify-center">
            {proofPreviewUrl && proofPreviewType === 'image' && (
              <img src={proofPreviewUrl} alt="Proof preview" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl" />
            )}
            {proofPreviewUrl && proofPreviewType === 'pdf' && (
              <iframe src={proofPreviewUrl} className="w-full h-[60vh] rounded-lg" title="PDF preview" />
            )}
          </div>
          <div className="flex justify-end border-t border-white/[0.07] px-6 py-3">
            <button onClick={() => window.open(proofPreviewUrl!, '_blank')} className="text-xs text-[#639922] hover:text-[#7fb82c] transition-colors flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> Open in new tab
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}