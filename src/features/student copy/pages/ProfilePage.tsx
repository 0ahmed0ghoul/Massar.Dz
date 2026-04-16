// pages/ProfilePage.tsx
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import { useStudentProfile } from "../hooks/useStudentProfile";

const ProfilePage = () => {
  const { 
    profile, 
    loading, 
    saving, 
    uploadingAvatar,
    updateProfile, 
    uploadAvatar, 
    deleteAvatar,
    uploadingCV,
    uploadCV,
    deleteCV,
  } = useStudentProfile();

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
      <ProfileForm
        profile={profile}
        saving={saving}
        uploadingAvatar={uploadingAvatar}
        updateProfile={updateProfile}
        uploadAvatar={uploadAvatar}
        deleteAvatar={deleteAvatar}
        uploadCV={uploadCV}
        deleteCV={deleteCV}
      />

    </div>
  );
};

export default ProfilePage;