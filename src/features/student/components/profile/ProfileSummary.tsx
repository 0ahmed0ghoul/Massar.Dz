const ProfileSummary = ({ profile }: { profile: any }) => {
  if (!profile) return null;

  return (
    <div className="p-4 border rounded bg-black/20">
      <p className="text-foreground">
        {profile.first_name || ""} {profile.last_name || ""}
      </p>
      <p className="text-foreground/40">{profile.email || "No email"}</p>
    </div>
  );
};

export default ProfileSummary;