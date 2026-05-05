// pages/ProfilePage.tsx
import ProfileForm from "../components/profile/ProfileForm";
import { UniversityConnectionCard } from "../components/UniversityConnectionCard";
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#639922] border-t-transparent sm:h-12 sm:w-12" />
          <p className="text-sm text-foreground/40 sm:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-foreground/60">
        No profile found. Please complete your registration.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="space-y-5 sm:space-y-6">
        {/* ProfileForm card */}
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

        {/* University Connection Card */}
        <UniversityConnectionCard
          profile={profile}
          onRequestConnection={requestUniversityConnection}
          isRequesting={false} // you can replace with a dedicated state if needed
        />

        {/* Help card */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Need help?</h3>
              <p className="text-sm text-foreground/40">
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
  );
};

export default ProfilePage;