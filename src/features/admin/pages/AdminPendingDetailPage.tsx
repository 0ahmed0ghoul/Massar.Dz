// features/admin/pages/AdminPendingDetailPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Building2, GraduationCap, Mail, MapPin, Globe, User, Briefcase, FileText, Download, Shield } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { useState } from "react";

export const AdminPendingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { approvePending, rejectPending, actionLoading } = useAdmin();
  const profile = location.state?.profile;
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/60">No profile data. <button onClick={() => navigate(-1)} className="text-[#639922]">Go back</button></p>
        </div>
      </div>
    );
  }

  const isUniversity = profile.role === "university_admin";
  const isCompany = profile.role === "company_admin";
  const verificationDocs = profile.verification_docs || {};

  const handleApprove = async () => {
    setLoading(true);
    const ok = await approvePending(profile);
    if (ok) navigate("/dashboard/admin/pending");
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    const ok = await rejectPending(profile);
    if (ok) navigate("/dashboard/admin/pending");
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="group mb-6 flex items-center gap-2 text-foreground/60 hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to pending list
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-400/10 p-2">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Review Application</h1>
              <p className="mt-1 text-sm text-foreground/40">{isUniversity ? "University" : "Company"} account verification</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReject} disabled={actionLoading || loading} className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50">
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button onClick={handleApprove} disabled={actionLoading || loading} className="flex items-center gap-2 rounded-xl bg-[#639922] px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[#4f7a1a] disabled:opacity-50">
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"><User className="h-5 w-5 text-[#639922]" /> Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-xs uppercase tracking-wider text-foreground/40">Full Name</label><p className="mt-1 text-foreground">{profile.first_name} {profile.last_name}</p></div>
              <div><label className="text-xs uppercase tracking-wider text-foreground/40">Email</label><p className="mt-1 text-foreground flex items-center gap-1"><Mail className="h-3 w-3 text-foreground/40" /> {profile.email}</p></div>
              <div><label className="text-xs uppercase tracking-wider text-foreground/40">Role</label><p className="mt-1 text-foreground capitalize">{profile.role.replace('_', ' ')}</p></div>
              <div><label className="text-xs uppercase tracking-wider text-foreground/40">City</label><p className="mt-1 text-foreground flex items-center gap-1"><MapPin className="h-3 w-3 text-foreground/40" /> {profile.city || '—'}</p></div>
            </div>
          </div>

          {/* Institution Details */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              {isUniversity ? <GraduationCap className="h-5 w-5 text-[#639922]" /> : <Building2 className="h-5 w-5 text-[#639922]" />}
              {isUniversity ? "University Details" : "Company Details"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {isUniversity ? (
                <>
                  <div className="sm:col-span-2"><label className="text-xs uppercase tracking-wider text-foreground/40">University Name</label><p className="mt-1 text-foreground">{profile.university_name || '—'}</p></div>
                  <div><label className="text-xs uppercase tracking-wider text-foreground/40">Rector Name</label><p className="mt-1 text-foreground">{profile.rector_name || '—'}</p></div>
                  <div><label className="text-xs uppercase tracking-wider text-foreground/40">Website</label><p className="mt-1 text-foreground flex items-center gap-1"><Globe className="h-3 w-3 text-foreground/40" /> {profile.website || '—'}</p></div>
                </>
              ) : (
                <>
                  <div className="sm:col-span-2"><label className="text-xs uppercase tracking-wider text-foreground/40">Company Name</label><p className="mt-1 text-foreground">{profile.company_name || '—'}</p></div>
                  <div><label className="text-xs uppercase tracking-wider text-foreground/40">Industry</label><p className="mt-1 text-foreground flex items-center gap-1"><Briefcase className="h-3 w-3 text-foreground/40" /> {profile.industry || '—'}</p></div>
                  <div className="sm:col-span-2"><label className="text-xs uppercase tracking-wider text-foreground/40">Company Description</label><p className="mt-1 text-foreground/80">{profile.company_description || '—'}</p></div>
                </>
              )}
            </div>
          </div>

          {/* Verification Documents */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"><FileText className="h-5 w-5 text-[#639922]" /> Verification Documents</h2>
            <div className="space-y-4">
              {verificationDocs.logo && (<div><label className="text-xs uppercase tracking-wider text-foreground/40">Logo</label><div className="mt-2"><img src={verificationDocs.logo} alt="Logo" className="h-20 w-20 rounded-full object-cover border border-white/20" /></div></div>)}
              {verificationDocs.registration_certificate && (<div><label className="text-xs uppercase tracking-wider text-foreground/40">Registration Certificate</label><div className="mt-2">{verificationDocs.registration_certificate.startsWith('data:image') ? (<img src={verificationDocs.registration_certificate} alt="Certificate" className="max-h-48 rounded-lg border border-white/20" />) : (<a href={verificationDocs.registration_certificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#639922] hover:underline"><Download className="h-4 w-4" /> View Document</a>)}</div></div>)}
              {verificationDocs.tax_id && (<div><label className="text-xs uppercase tracking-wider text-foreground/40">Tax ID / Registration Number</label><p className="mt-1 text-foreground">{verificationDocs.tax_id}</p></div>)}
              {Object.keys(verificationDocs).length === 0 && <p className="text-foreground/40">No documents uploaded.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-4 text-center text-xs text-foreground/30">
            Profile completed on {profile.completed_at ? new Date(profile.completed_at).toLocaleString() : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};