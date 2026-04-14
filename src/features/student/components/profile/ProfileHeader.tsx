import { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

const ProfileHeader = ({ profile }: { profile: Profile }) => {
  const fields = [
    profile.first_name,
    profile.last_name,
    profile.email,
    profile.degree_level,
    profile.university_name,
    profile.specialty,
    profile.wilaya,
  ];

  const filled = fields.filter((f) => f && f.trim() !== "").length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <div className="p-4 border rounded bg-black/20">
      <h1 className="text-white text-lg font-semibold">Profile</h1>

      <p className="text-white/40 text-sm mt-1">
        Completeness:{" "}
        <span className="text-white">{completeness}%</span>
      </p>
    </div>
  );
};

export default ProfileHeader;