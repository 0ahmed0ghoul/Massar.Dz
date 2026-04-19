// pages/ProfilePage.tsx
import ProfileForm from "../components/profile/ProfileForm.tsx";
import ProfileHeader from "../components/profile/ProfileHeader.tsx";
import { ThemeToggle } from "../components/ThemeToggle.tsx";
import { UniversityConnectionCard } from "../components/UniversityConnectionCard.tsx";
import { useProfilePage } from "../hooks/useProfilePage";

const ProfilePage = () => {
  const {
    profile,
    loading,
    saving,
    uploadingAvatar,
    uploadingCV,
    uploadingStudentCard,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    uploadCV,
    deleteCV,
    uploadStudentCard,
    deleteStudentCard,
    requestUniversityConnection,
  } = useProfilePage();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent sm:h-12 sm:w-12" />
          <p className="text-sm text-white/40 sm:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e] px-4 text-center text-white/60">
        No profile found. Please complete your registration.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0c0e]">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header – stack on mobile, row on larger */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Student Profile</h1>
            <p className="text-xs text-white/40 sm:text-sm">
              Manage your academic identity and career readiness
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Cards – reduce padding on mobile, keep consistent spacing */}
        <div className="space-y-5 sm:space-y-6">
          {/* ProfileHeader card wrapper */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <ProfileHeader profile={profile} />
            </div>
          </div>

          {/* ProfileForm card wrapper */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <ProfileForm
                profile={profile}
                saving={saving}
                uploadingAvatar={uploadingAvatar}
                uploadingCV={uploadingCV}
                uploadingStudentCard={uploadingStudentCard}
                updateProfile={updateProfile}
                uploadAvatar={uploadAvatar}
                deleteAvatar={deleteAvatar}
                uploadCV={uploadCV}
                deleteCV={deleteCV}
                uploadStudentCard={uploadStudentCard}
                deleteStudentCard={deleteStudentCard}
              />
            </div>
          </div>

          {/* UniversityConnectionCard wrapper */}
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <div className="p-4 sm:p-6">
              <UniversityConnectionCard
                profile={profile}
                onRequestConnection={requestUniversityConnection}
              />
            </div>
          </div>

          {/* Help card – improved for mobile */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-white">Need help?</h3>
                <p className="text-sm text-white/40">
                  Complete all fields and upload required documents to proceed with admin verification.
                  Once verified, you can connect with your university to claim certificates.
                </p>
              </div>
              <button className="self-start rounded-lg border border-[#639922]/30 bg-[#639922]/10 px-4 py-2 text-sm font-medium text-[#639922] transition hover:bg-[#639922]/20 md:self-auto">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;