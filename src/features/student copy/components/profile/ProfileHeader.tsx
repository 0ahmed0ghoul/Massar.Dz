import { Tables } from "@/types/database";
import { UserCircle } from "lucide-react";

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
    profile.avatar_url,
    profile.resume_url ,
  ];

  const filled = fields.filter((f) => f && f.trim() !== "").length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <div className="p-5 border rounded-lg bg-black/20 space-y-4">
      {/* Avatar + Name row */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#639922]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-white/40" />
          </div>
        )}
        <div>
          <h1 className="text-white text-xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-white/40 text-sm capitalize">{profile.role}</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
            Completeness: <span className="text-[#639922] font-bold">{completeness}%</span>
          </span>
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;