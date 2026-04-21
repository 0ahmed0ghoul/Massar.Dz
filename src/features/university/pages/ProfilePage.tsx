// pages/UniversityProfilePage.tsx

import { ThemeToggle } from "@/features/student/components/ThemeToggle.tsx";
import { useUniversityProfile } from "../hooks/useUniversityProfile";
import UniversityProfileHeader from "../components/UniversityProfileHeader";
import UniversityProfileForm from "../components/UniversityProfileForm";
import UniversityConnectionsCard from "../components/UniversityConnectionsCard";


const UniversityProfilePage = () => {
  const {
    university,
    loading,
    saving,
    uploadingLogo,
    updateUniversity,
    uploadLogo,
    deleteLogo,
    connectedStudents,
    pendingRequests,
    acceptRequest,
    rejectRequest,
  } = useUniversityProfile();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent sm:h-12 sm:w-12" />
          <p className="text-sm text-foreground/40 sm:text-base">Loading university profile...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-foreground/60">
        No university profile found. Please complete your registration.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid texture */}
<div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header – stack on mobile, row on larger */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">University Profile</h1>
            <p className="text-xs text-foreground/40 sm:text-sm">
              Manage your institution’s information and student connections
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-5 sm:space-y-6">
          {/* UniversityProfileHeader card */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <UniversityProfileHeader university={university} />
            </div>
          </div>

          {/* UniversityProfileForm card */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <UniversityProfileForm
                university={university}
                saving={saving}
                uploadingLogo={uploadingLogo}
                updateUniversity={updateUniversity}
                uploadLogo={uploadLogo}
                deleteLogo={deleteLogo}
              />
            </div>
          </div>

          {/* UniversityConnectionsCard card */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <UniversityConnectionsCard
                connectedStudents={connectedStudents}
                pendingRequests={pendingRequests}
                onAccept={acceptRequest}
                onReject={rejectRequest}
              />
            </div>
          </div>

          {/* Help card */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Need help managing connections?</h3>
                <p className="text-sm text-foreground/40">
                  Import students via XLSX, verify their profiles, and review connection requests.
                  Once connected, students can claim certificates and update outcomes.
                </p>
              </div>
              <button className="self-start rounded-lg border border-[#639922]/30 bg-[#639922]/10 px-4 py-2 text-sm font-medium text-[#639922] transition hover:bg-[#639922]/20 md:self-auto">
                Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePage;