// components/ApplicationDetailModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  Loader2,
  FileText,
  Mail,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  UserCheck,
  Eye,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    classes: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
  reviewing: {
    label: "Reviewing",
    dot: "bg-sky-400",
    classes: "border-sky-500/20   bg-sky-500/10   text-sky-400",
  },
  shortlisted: {
    label: "Shortlisted",
    dot: "bg-emerald-400",
    classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  interview: {
    label: "Interview",
    dot: "bg-violet-400",
    classes: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    classes: "border-red-500/20   bg-red-500/10   text-red-400",
  },
  hired: {
    label: "Hired",
    dot: "bg-[#639922]",
    classes: "border-[#639922]/20 bg-[#639922]/10 text-[#639922]",
  },
};

const STATUS_OPTIONS = [
  "pending",
  "reviewing",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
];

interface ApplicationDetailModalProps {
  application: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateRating: (id: string, rating: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  updating: string | null;
}

export function ApplicationDetailModal({
  application,
  open,
  onOpenChange,
  onUpdateStatus,
  onUpdateRating,
  onUpdateNotes,
  updating,
}: ApplicationDetailModalProps) {
  const [localNotes, setLocalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (application) {
      setLocalNotes(application.notes || "");
    }
  }, [application]);

  if (!application) return null;

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await onUpdateNotes(application.id, localNotes);
    setSavingNotes(false);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const statusCfg =
    STATUS_CONFIG[application.status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.pending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-white/[0.09] bg-[#0f1117] p-0 gap-0">
        {/* Header with gradient line */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#639922]/40 to-transparent" />
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
                <Eye className="h-4 w-4 text-[#639922]" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white/90">
                  Application Details
                </DialogTitle>
                <DialogDescription className="text-[11px] text-white/35 mt-0.5">
                  Review candidate information and manage application
                </DialogDescription>
              </div>
            </div>
            {/* Status badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${statusCfg.classes}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl border border-white/10">
              <AvatarImage src={application.student?.avatar_url} />
              <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-lg font-semibold">
                {getInitials(
                  `${application.student?.first_name} ${application.student?.last_name}`
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white/90">
                {application.student?.first_name}{" "}
                {application.student?.last_name}
              </h3>
              <div className="flex flex-wrap gap-3 mt-1 text-[12px] text-white/45">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {application.student?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />{" "}
                  {application.student?.university_name || "University not set"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Applied{" "}
                  {new Date(application.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {application.ai_match_score && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-white/30">AI Match</span>
                <span className="text-sm font-bold text-[#639922]">
                  {Math.round(application.ai_match_score)}%
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
              Rating
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onUpdateRating(application.id, r)}
                  className="p-0.5 transition hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-5 w-5 transition-colors",
                      r <= application.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-white/15 hover:text-amber-400/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Status Selector with custom styling like main page */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
              Status
            </Label>
            <div className="relative w-48">
              <select
                value={application.status}
                disabled={updating === application.id}
                onChange={(e) => onUpdateStatus(application.id, e.target.value)}
                className={`
                  w-full appearance-none cursor-pointer rounded-lg border pl-3 pr-7 py-2
                  text-[12px] font-semibold transition-all outline-none
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${statusCfg.classes}
                `}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-[#0f1117] text-white capitalize"
                  >
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Cover Letter
              </Label>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-[13px] text-white/70 whitespace-pre-wrap">
                {application.cover_letter}
              </div>
            </div>
          )}

          {/* CV */}
          {application.cv_url && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                CV / Resume
              </Label>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              >
                <a
                  href={application.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-3 w-3 mr-1" /> View CV
                </a>
              </Button>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
              Internal Notes
            </Label>
            <Textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              rows={4}
              className="bg-white/[0.03] border-white/[0.08] text-white/80 placeholder:text-white/20 resize-none focus:border-[#639922]/40 focus:ring-1 focus:ring-[#639922]/20"
              placeholder="Add interview feedback, strengths, concerns..."
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveNotes}
                disabled={
                  savingNotes || localNotes === (application.notes || "")
                }
                className="border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
              >
                {savingNotes ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : null}
                Save Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Footer with subtle border */}
        <div className="border-t border-white/[0.05] px-6 py-3 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/40 hover:text-white/70 hover:bg-white/5"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
