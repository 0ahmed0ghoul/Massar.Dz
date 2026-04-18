// components/ProfileHeader.tsx
import { Tables } from "@/types/database";
import { UserCircle, Shield, Building2, Award, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCompletionJourney, Step } from "../ProfileCompletionJourney";

type Profile = Tables<"profiles">;

const ProfileHeader = ({ profile }: { profile: Profile }) => {
  // Required fields for completion (exclude boolean columns)
  const requiredFields = [
    profile.first_name,
    profile.last_name,
    profile.email,
    profile.degree_level,
    profile.university_name,
    profile.specialty,
    profile.wilaya,
    profile.avatar_url,
    profile.resume_url,
    profile.academic_year,
    profile.specialty_type,
    profile.student_card_url,
    profile.student_id,
  ];

  const filled = requiredFields.filter((f) => f && String(f).trim() !== "").length;
  const completeness = Math.round((filled / requiredFields.length) * 100);

  const basicInfoComplete = !!(profile.first_name && profile.last_name && profile.email);
  const academicInfoComplete = !!(profile.degree_level && profile.university_name && profile.specialty && profile.academic_year && profile.specialty_type);
  const documentsComplete = !!(profile.avatar_url && profile.resume_url && profile.student_card_url && profile.student_id);
  const allFieldsComplete = completeness === 100;

  // Determine current step (0-indexed)
  let currentStepIndex = 0;
  if (!basicInfoComplete) currentStepIndex = 0;
  else if (!academicInfoComplete) currentStepIndex = 1;
  else if (!documentsComplete) currentStepIndex = 2;
  else if (!profile.isVerified) currentStepIndex = 3; // admin verification needed
  else if (!profile.university_connection_status) currentStepIndex = 4; // university connection needed
  else currentStepIndex = 5; // all done

  const steps: Step[] = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Complete your personal details",
      icon: <User className="h-7 w-7" />,
      status: basicInfoComplete ? "completed" : "current",
    },
    {
      id: "academic",
      title: "Academic Details",
      description: "Add your educational background",
      icon: <Shield className="h-7 w-7" />,
      status: basicInfoComplete
        ? academicInfoComplete
          ? "completed"
          : "current"
        : "locked",
    },
    {
      id: "documents",
      title: "Upload Documents",
      description: "Student card, CV, and profile picture",
      icon: <UserCircle className="h-7 w-7" />,
      status: academicInfoComplete
        ? documentsComplete
          ? "completed"
          : "current"
        : "locked",
    },
    {
      id: "admin-verification",
      title: "Admin Verification",
      description: "Awaiting admin approval",
      icon: <Shield className="h-7 w-7" />,
      status: allFieldsComplete
        ? profile.isVerified
          ? "completed"
          : "current"
        : "locked",
    },
    {
      id: "university-connection",
      title: "University Connection",
      description: "Connect with your university",
      icon: <Building2 className="h-7 w-7" />,
      status: profile.isVerified
        ? profile.university_connection_status
          ? "completed"
          : "current"
        : "locked",
    },
    {
      id: "certificate",
      title: "Ready for Certification",
      description: "Claim your certificates",
      icon: <Award className="h-7 w-7" />,
      status: profile.university_connection_status ? "completed" : "locked",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main profile card – glassmorphic, dark, green accent */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#639922]/10 blur-3xl" />
        <div className="relative z-10 p-6">
          <div className="flex flex-wrap items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="h-24 w-24 rounded-2xl border-2 border-[#639922] object-cover shadow-lg shadow-[#639922]/30"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-[#639922]/30 bg-gradient-to-br from-[#639922]/20 to-[#639922]/5">
                  <UserCircle className="h-12 w-12 text-white/40" />
                </div>
              )}
              {profile.isVerified === true && (
                <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-[#0b0c0e] bg-[#639922] p-1 shadow-lg shadow-[#639922]/50">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="mb-1 text-2xl font-bold text-white">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="mb-3 text-sm capitalize text-white/40">{profile.role}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#639922]/30 bg-[#639922]/10 px-3 py-1 text-xs font-medium text-[#639922]">
                  <Shield className="h-3.5 w-3.5" />
                  {profile.isVerified ? "Verified Student" : "Unverified"}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                    profile.university_connection_status
                      ? "border-[#639922]/30 bg-[#639922]/10 text-[#639922]"
                      : "border-white/[0.08] bg-white/[0.04] text-white/40"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {profile.university_connection_status ? "University Connected" : "Not Connected"}
                </span>
              </div>
            </div>

            {/* Completion circle */}
            <div className="flex-shrink-0">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-white/[0.08]"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * completeness) / 100}
                    className="text-[#639922] transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{completeness}%</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey map – same glass styling */}
      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30">
        <ProfileCompletionJourney currentStep={currentStepIndex} steps={steps} />
      </div>
    </div>
  );
};

export default ProfileHeader;