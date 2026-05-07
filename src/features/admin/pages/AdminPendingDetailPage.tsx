// features/admin/pages/AdminPendingDetailPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  Globe,
  User,
  Briefcase,
  FileText,
  Shield,
  Award,
  Calendar,
  BookOpen,
  Hash,
  CreditCard,
  Image,
  Eye,
  X,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePendingVerification } from "../hooks/usePendingVerification";

export const AdminPendingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    approveInstitution,
    approveStudent,
    rejectProfile,
    getConnectionStatus,
    actionLoading,
  } = usePendingVerification();

  const profile = location.state?.profile;
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/60">
            No profile data.{" "}
            <button onClick={() => navigate(-1)} className="text-[#639922]">
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  const isUniversity = profile.role === "university_admin";
  const isCompany = profile.role === "company_admin";
  const isStudent = profile.role === "student";
  const verificationDocs = profile.verification_docs || {};

  // Fetch connection status for students
  useEffect(() => {
    if (isStudent && profile.university_name) {
      let isMounted = true;
      const fetchStatus = async () => {
        setLoadingStatus(true);
        try {
          const status = await getConnectionStatus(
            profile.id,
            profile.university_name
          );
          if (isMounted) setConnectionStatus(status);
        } catch (err) {
          console.error(err);
        } finally {
          if (isMounted) setLoadingStatus(false);
        }
      };
      fetchStatus();
      return () => {
        isMounted = false;
      };
    }
  }, [isStudent, profile, getConnectionStatus]);

  const handleApproveClick = () => {
    if (isStudent && profile.university_name) {
      setShowApprovalDialog(true);
    } else {
      confirmApprove(false);
    }
  };

  const confirmApprove = async (sendInvitation: boolean) => {
    setShowApprovalDialog(false);
    setLoading(true);
    try {
      let ok = false;
      if (isStudent) {
        ok = await approveStudent(profile, sendInvitation, user?.id);
      } else {
        ok = await approveInstitution(profile);
      }
      if (ok) navigate("/dashboard/admin/pending");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const ok = await rejectProfile(profile);
      if (ok) navigate("/dashboard/admin/pending");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewTitle("");
  };

  const renderDocCard = (url: string, label: string, icon: React.ReactNode) => {
    if (!url) return null;
    const isImage =
      url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.startsWith("data:image");
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-foreground/40">
                {isImage ? "Image file" : "PDF document"}
              </p>
            </div>
          </div>
          <button
            onClick={() => openPreview(url, label)}
            className="flex items-center gap-2 rounded-lg bg-[#639922]/20 px-3 py-1.5 text-xs font-medium text-[#639922] transition hover:bg-[#639922]/30"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to pending list
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-400/10 p-2">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Review Application
              </h1>
              <p className="mt-1 text-sm text-foreground/40">
                {isStudent
                  ? "Student profile verification"
                  : isUniversity
                  ? "University account verification"
                  : "Company account verification"}
              </p>
            </div>
          </div>
          {profile.is_verified ? (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">
              Approved
            </span>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading !== null || loading}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button
                onClick={handleApproveClick}
                disabled={actionLoading !== null || loading}
                className="flex items-center gap-2 rounded-xl bg-[#639922] px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[#4f7a1a] disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Basic Information - Fixed status badge */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-[#639922]" /> Basic Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/40">
                  Full Name
                </label>
                <p className="mt-1 text-foreground">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/40">
                  Email
                </label>
                <p className="mt-1 text-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3 text-foreground/40" />{" "}
                  {profile.email}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/40">
                  Role
                </label>
                <p className="mt-1 text-foreground capitalize">
                  {profile.role.replace("_", " ")}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/40">
                  Wilaya / City
                </label>
                <p className="mt-1 text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-foreground/40" />{" "}
                  {profile.wilaya || profile.city || "—"}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-foreground/40">
                  Status
                </label>
                <p className="mt-1">
                  {profile.is_verified ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">
                      Approved
                    </span>
                  ) : profile.is_completed === false ? (
                    <span className="rounded-full bg-red-400/20 px-2 py-0.5 text-xs text-red-400">
                      Profile incomplete
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-400">
                      Pending verification
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Institution Details (university or company) */}
          {(isUniversity || isCompany) && (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                {isUniversity ? (
                  <GraduationCap className="h-5 w-5 text-[#639922]" />
                ) : (
                  <Building2 className="h-5 w-5 text-[#639922]" />
                )}
                {isUniversity ? "University Details" : "Company Details"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {isUniversity ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        University Name
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.university_name || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Rector Name
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.rector_name || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Website
                      </label>
                      <p className="mt-1 text-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3 text-foreground/40" />{" "}
                        {profile.website || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Department
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.department || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Position
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.position || "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Company Name
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.company_name || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Company Type
                      </label>
                      <p className="mt-1 text-foreground">
                        {profile.company_type || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Industry
                      </label>
                      <p className="mt-1 text-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-foreground/40" />{" "}
                        {profile.industry || "—"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider text-foreground/40">
                        Company Description
                      </label>
                      <p className="mt-1 text-foreground/80">
                        {profile.company_description || "—"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Student Academic Information */}
          {isStudent && (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <GraduationCap className="h-5 w-5 text-[#639922]" /> Academic
                Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    University
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.university_name || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Department
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.department || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Degree Level
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.degree_level || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Speciality / Major
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.speciality || profile.major || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Academic Year
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.academic_year || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Graduation Year
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.graduation_year || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Student ID
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.student_id || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-foreground/40">
                    Speciality Type
                  </label>
                  <p className="mt-1 text-foreground">
                    {profile.speciality_type || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {profile.skills &&
            Array.isArray(profile.skills) &&
            profile.skills.length > 0 && (
              <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Award className="h-5 w-5 text-[#639922]" /> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#639922]/20 px-3 py-1 text-sm text-[#639922]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Verification Documents */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="h-5 w-5 text-[#639922]" /> Uploaded Documents
            </h2>
            <div className="space-y-4">
              {isUniversity && profile.avatar_url && (
                <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Image className="h-5 w-5 text-[#639922]" />
                    University Logo
                  </h2>

                  <div className="flex items-center gap-4">
                    <img
                      src={profile.avatar_url}
                      alt="University Logo"
                      className="h-20 w-20 rounded-full object-cover border border-white/10"
                    />

                    <button
                      onClick={() =>
                        openPreview(profile.avatar_url!, "University Logo")
                      }
                      className="flex items-center gap-2 rounded-lg bg-[#639922]/20 px-3 py-1.5 text-xs font-medium text-[#639922] transition hover:bg-[#639922]/30"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                  </div>
                </div>
              )}
              {isStudent && (
                <>
                  {profile.resume_url &&
                    renderDocCard(
                      profile.resume_url,
                      "CV / Resume",
                      <FileText className="h-8 w-8 text-[#639922]" />
                    )}
                  {profile.student_card_url &&
                    renderDocCard(
                      profile.student_card_url,
                      "Student Card",
                      <CreditCard className="h-8 w-8 text-[#639922]" />
                    )}
                </>
              )}
              {(isUniversity || isCompany) && (
                <>
                  {verificationDocs.logo &&
                    renderDocCard(
                      verificationDocs.logo,
                      "Logo",
                      <Image className="h-8 w-8 text-[#639922]" />
                    )}
                  {verificationDocs.registration_certificate &&
                    renderDocCard(
                      verificationDocs.registration_certificate,
                      "Registration Certificate",
                      <FileText className="h-8 w-8 text-[#639922]" />
                    )}
                  {verificationDocs.tax_id && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Hash className="h-8 w-8 text-[#639922]" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Tax ID / Registration Number
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">
                          {verificationDocs.tax_id}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {!profile.avatar_url &&
                (!isStudent ||
                  (!profile.resume_url && !profile.student_card_url)) &&
                ((!isUniversity && !isCompany) ||
                  Object.keys(verificationDocs).length === 0) && (
                  <p className="text-foreground/40">No documents uploaded.</p>
                )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-4 text-center text-xs text-foreground/30">
            Profile {profile.is_completed ? "completed" : "not completed"} on{" "}
            {profile.completed_at
              ? new Date(profile.completed_at).toLocaleString()
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Student Profile</DialogTitle>
            <DialogDescription>
              Do you want to send a connection invitation to the student's
              university ({profile.university_name})? This will allow the
              student to request certificates and communicate with the
              university.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => confirmApprove(false)}>
              Approve Only
            </Button>
            <Button
              onClick={() => confirmApprove(true)}
              className="bg-[#639922] text-black hover:bg-[#4f7a1a]"
            >
              Approve & Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for document preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-lg bg-background p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 rounded-full bg-white/10 p-2 text-foreground hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-2 text-center text-sm font-medium text-foreground">
              {previewTitle}
            </h3>
            <div className="flex justify-center">
              {previewUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
              previewUrl.startsWith("data:image") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[70vh] max-w-[80vw] rounded object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title="Document Preview"
                  className="h-[70vh] w-[80vw] rounded bg-white"
                  frameBorder="0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
