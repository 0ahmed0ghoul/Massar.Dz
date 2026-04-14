import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import { useStudentProfile } from "../hooks/useStudentProfile";

const ProfilePage = () => {
  const { profile, loading, saving, updateProfile } = useStudentProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        No profile found
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ProfileHeader profile={profile} />

      <ProfileForm
        profile={profile}
        saving={saving}
        updateProfile={updateProfile}
      />

      <ProfileSummary profile={profile} />
    </div>
  );
};

export default ProfilePage;