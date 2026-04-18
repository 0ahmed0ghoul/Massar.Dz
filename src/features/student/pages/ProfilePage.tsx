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
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" />
          <p className="text-white/40">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e] text-white/60">
        No profile found. Please complete your registration.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0c0e]">
      {/* Grid texture – same as hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orb – same as hero */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        {/* Header with theme toggle and subtle welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Profile</h1>
            <p className="text-sm text-white/40">Manage your academic identity and career readiness</p>
          </div>
          <ThemeToggle />
        </div>

        {/* All cards with glassmorphism + border glow on hover */}
        <div className="space-y-6">
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <ProfileHeader profile={profile} />
          </div>

          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
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

          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5">
            <UniversityConnectionCard
              profile={profile}
              onRequestConnection={requestUniversityConnection}
            />
          </div>

          {/* Help card – subtle and inline with the design */}
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-white">Need help?</h3>
                <p className="text-sm text-white/40">
                  Complete all fields and upload required documents to proceed with admin verification.
                  Once verified, you can connect with your university to claim certificates.
                </p>
              </div>
              <button className="text-sm font-medium text-[#639922] transition hover:text-[#7ab93e]">
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