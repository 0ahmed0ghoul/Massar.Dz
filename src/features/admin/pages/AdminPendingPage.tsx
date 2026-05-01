// features/admin/pages/AdminPendingPage.tsx
import { useEffect, useState } from "react";
import { RefreshCw, School, Building2, Shield, Clock, GraduationCap } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { PendingList } from "../components/PendingList";
import { Profile } from "../services/admin.service";
import { PendingFilter } from "../constants/admin.constants";

export const AdminPendingPage = () => {
  const { fetchPendingProfiles, fetchPendingStudents, approvePending, rejectPending, approveStudent, rejectStudent, actionLoading, loading } = useAdmin();
  const [institutionProfiles, setInstitutionProfiles] = useState<Profile[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState<PendingFilter>("all");

  const loadPending = async () => {
    const [institutions, students] = await Promise.all([
      fetchPendingProfiles(),
      fetchPendingStudents(),
    ]);
    setInstitutionProfiles(institutions);
    setStudentProfiles(students);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (profile: Profile) => {
    const ok = await approvePending(profile);
    if (ok) loadPending();
  };

  const handleReject = async (profile: Profile) => {
    const ok = await rejectPending(profile);
    if (ok) loadPending();
  };

  const handleVerifyStudent = async (profile: Profile) => {
    const ok = await approveStudent(profile);
    if (ok) loadPending();
  };

  const handleRejectStudent = async (profile: Profile) => {
    const ok = await rejectStudent(profile);
    if (ok) loadPending();
  };

  const getDisplayProfiles = () => {
    switch (filter) {
      case "students":
        return studentProfiles;
      case "university_admin":
        return institutionProfiles.filter(p => p.role === "university_admin");
      case "company_admin":
        return institutionProfiles.filter(p => p.role === "company_admin");
      default:
        return [...institutionProfiles, ...studentProfiles];
    }
  };

  const counts = {
    all: institutionProfiles.length + studentProfiles.length,
    university_admin: institutionProfiles.filter(p => p.role === "university_admin").length,
    company_admin: institutionProfiles.filter(p => p.role === "company_admin").length,
    students: studentProfiles.length,
  };

  const displayedProfiles = getDisplayProfiles();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background grid & glow (same as before) */}
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-400/10 p-2">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Pending Verifications</h1>
                <p className="mt-1 text-sm text-foreground/40">
                  Review and approve institutions, companies & student profiles
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={loadPending}
            disabled={loading}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/60 backdrop-blur-sm transition-all hover:border-[#639922]/30 hover:bg-white/[0.05] hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 transition-transform duration-300 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-1 backdrop-blur-sm">
          {(["all", "university_admin", "company_admin", "students"] as PendingFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-gradient-to-r from-[#639922]/20 to-[#639922]/10 text-foreground shadow-lg"
                  : "text-foreground/40 hover:text-foreground hover:bg-white/5"
              }`}
            >
              {f === "all" && <><Shield className="h-3.5 w-3.5" /> All</>}
              {f === "university_admin" && <><School className="h-3.5 w-3.5" /> Universities</>}
              {f === "company_admin" && <><Building2 className="h-3.5 w-3.5" /> Companies</>}
              {f === "students" && <><GraduationCap className="h-3.5 w-3.5" /> Students</>}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                  counts[f] > 0
                    ? "bg-amber-400 text-black shadow-sm"
                    : "bg-white/10 text-foreground/40"
                }`}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Pending List Card */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#639922]" />
                <h2 className="text-lg font-semibold text-foreground">
                  {filter === "all" ? "All Pending" :
                   filter === "students" ? "Students Pending Verification" :
                   filter === "university_admin" ? "Universities Pending Approval" : "Companies Pending Approval"}
                </h2>
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                  {displayedProfiles.length} pending
                </span>
              </div>
            </div>

            <PendingList
              profiles={displayedProfiles}
              actionLoading={actionLoading}
              onApprove={filter === "students" ? handleVerifyStudent : handleApprove}
              onReject={filter === "students" ? handleRejectStudent : handleReject}
              loading={loading}
            />
          </div>
        </div>


      </div>
    </div>
  );
};