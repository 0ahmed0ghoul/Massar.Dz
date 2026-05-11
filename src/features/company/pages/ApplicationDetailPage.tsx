// features/company/pages/ApplicationDetailPage.tsx
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  User,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  X,
  ChevronDown,
  Clock,
  Link as LinkIcon,
  MapPin as MapPinIcon,
  FileText as NoteIcon,
  Brain,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useApplicationDetail } from "../hooks/useApplicationDetail";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  AppStatus,
  STATUS_CONFIG,
  STATUS_OPTIONS,
} from "@/constants/application.constant";
import { ResumeParser } from "../components/ResumeParser";

// Helper to normalise skills into an array
const getSkillsArray = (skills: any): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// Interview form data type
interface InterviewFormData {
  interview_date: string;
  location: string;
  meeting_link: string;
  notes: string;
}

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { application, loading, updating, updateStatus, scheduleInterview } =
    useApplicationDetail();
  const { profile } = useAuth();

  // Document preview state
  const [previewDoc, setPreviewDoc] = useState<{
    url: string;
    title: string;
  } | null>(null);
  // Interview modal state
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState<InterviewFormData>({
    interview_date: "",
    location: "",
    meeting_link: "",
    notes: "",
  });
  const [submittingInterview, setSubmittingInterview] = useState(false);

  const openPreview = (url: string, title: string) =>
    setPreviewDoc({ url, title });
  const closePreview = () => setPreviewDoc(null);

  // Handle status change from dropdown
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "interview") {
      setIsInterviewModalOpen(true);
      return;
    }
    await updateStatus(application.id, newStatus);
  };

  // Handle interview form submission
  const handleScheduleInterview = async () => {
    if (!interviewForm.interview_date) {
      alert("Please select an interview date and time.");
      return;
    }
    if (!interviewForm.location && !interviewForm.meeting_link) {
      alert("Please provide either a location or a meeting link.");
      return;
    }

    setSubmittingInterview(true);
    try {
      await scheduleInterview(application.id, interviewForm);
      setIsInterviewModalOpen(false);
      setInterviewForm({
        interview_date: "",
        location: "",
        meeting_link: "",
        notes: "",
      });
      await updateStatus(application.id, "interview_scheduled");
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setSubmittingInterview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-foreground/60">Application not found.</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const { job, candidate, cover_letter, status, created_at } = application;
  const skillsArray = getSkillsArray(candidate.skills);

  const getStatusBadge = () => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500/20 text-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>;
      case "interview_scheduled":
        return <Badge className="bg-blue-500/20 text-blue-400">Interview Scheduled</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
    }
  };

  const isPdf = (url: string) => url.toLowerCase().includes(".pdf");
  const isImage = (url: string) =>
    url.match(/\.(jpeg|jpg|png|gif|webp)$/i) || url.includes("image");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {previewDoc.title}
                </h2>
                <p className="text-sm text-white/40">Document Preview</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePreview}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden bg-[#0b0b0b]">
              {isPdf(previewDoc.url) || !isImage(previewDoc.url) ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.title}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center overflow-auto p-6">
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title}
                    className="max-h-full rounded-xl object-contain shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interview Scheduling Modal */}
      <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0f1117] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription className="text-foreground/60">
              Set up the interview details for {candidate.first_name}{" "}
              {candidate.last_name}. This will replace any previous interview
              records.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="interview_date" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#639922]" /> Date & Time
              </Label>
              <Input
                id="interview_date"
                type="datetime-local"
                value={interviewForm.interview_date}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    interview_date: e.target.value,
                  })
                }
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-[#639922]" /> Location
                (optional if online)
              </Label>
              <Input
                id="location"
                placeholder="Office address, conference room, etc."
                value={interviewForm.location}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, location: e.target.value })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meeting_link" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-[#639922]" /> Meeting Link
                (optional)
              </Label>
              <Input
                id="meeting_link"
                placeholder="https://meet.google.com/..."
                value={interviewForm.meeting_link}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, meeting_link: e.target.value })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <NoteIcon className="h-4 w-4 text-[#639922]" /> Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any instructions or preparation details for the candidate..."
                value={interviewForm.notes}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, notes: e.target.value })
                }
                className="bg-white/5 border-white/10"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInterviewModalOpen(false)}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={submittingInterview}
              className="bg-[#639922] text-black hover:bg-[#4f7a1a]"
            >
              {submittingInterview ? "Scheduling..." : "Schedule & Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back button */}
      <button
        onClick={() => navigate("/company/dashboard/applications")}
        className="group mb-6 flex items-center gap-2 text-foreground/60 transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Applications
      </button>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Application Details</h1>
            <p className="text-sm text-foreground/40">
              Review candidate information and application
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Job Summary Card */}
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#639922]" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{job.title}</p>
              <p className="text-sm text-foreground/60">
                {job.company} • {job.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Applied{" "}
                {new Date(created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-foreground/80">{job.description}</p>
          </CardContent>
        </Card>

        {/* Candidate Profile Card */}
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#639922]" />
              Candidate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-4">
              {candidate.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt="avatar"
                  className="h-16 w-16 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#639922]/20">
                  <User className="h-8 w-8 text-[#639922]" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground">
                  {candidate.first_name} {candidate.last_name}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {candidate.email}
                  </span>
                </div>
                {candidate.degree_level && (
                  <p className="mt-1 text-sm text-foreground/60">
                    {candidate.degree_level} • {candidate.speciality || "—"}
                  </p>
                )}
                {candidate.university_name && (
                  <p className="text-sm text-foreground/40">
                    {candidate.university_name} • Graduated:{" "}
                    {candidate.graduation_year || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {skillsArray.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground/70">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#639922]/10 px-2.5 py-0.5 text-xs text-[#639922]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-sm font-medium text-foreground/70">Documents</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {candidate.resume_url && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#639922]/10 p-2">
                          <FileText className="h-5 w-5 text-[#639922]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Resume / CV</p>
                          <p className="text-xs text-foreground/40">Preview document</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 bg-transparent hover:bg-white/5"
                        onClick={() => openPreview(candidate.resume_url, "Resume / CV")}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </div>
                  </div>
                )}
                {candidate.student_card_url && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#639922]/10 p-2">
                          <FileText className="h-5 w-5 text-[#639922]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Student ID Card</p>
                          <p className="text-xs text-foreground/40">Preview document</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 bg-transparent hover:bg-white/5"
                        onClick={() =>
                          openPreview(candidate.student_card_url, "Student ID Card")
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {cover_letter && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground/70">Cover Letter</p>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="whitespace-pre-wrap text-sm text-foreground/80">
                    {cover_letter}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Resume Parser (Premium) */}
        {profile?.is_premium && candidate.resume_url && (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#639922]" />
                AI Resume Parser (Premium)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ResumeParser resumeUrl={candidate.resume_url} /> */}Coming Soon
            </CardContent>
          </Card>
        )}

        {/* Actions - Status Dropdown */}
        <div className="flex justify-end pt-4">
          <div className="relative w-full sm:w-64">
            <select
              value={status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`
                w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-semibold outline-none transition-all
                bg-white/[0.03] backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed
                ${STATUS_CONFIG[status as AppStatus]?.classes ?? STATUS_CONFIG.pending.classes}
              `}
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-[#0f1117] text-white capitalize"
                >
                  {STATUS_CONFIG[option].label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}