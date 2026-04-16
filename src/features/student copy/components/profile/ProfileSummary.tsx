const ProfileSummary = ({ profile }: { profile: any }) => {
  if (!profile) return null;

  return (
    <div className="p-4 border rounded bg-black/20">
      <p className="text-white">
        {profile.first_name || ""} {profile.last_name || ""}
      </p>
      <p className="text-white/40">{profile.email || "No email"}</p>
    </div>
  );
};

export default ProfileSummary;