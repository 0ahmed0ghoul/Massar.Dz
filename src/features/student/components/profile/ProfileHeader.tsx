import {
  UserCircle,
  Shield,
  Building2,
  Award,
  CheckCircle2,
  User,
  GraduationCap,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProfileCompletionJourney,
  
} from "../ProfileCompletionJourney";
import { CandidateType, Profile } from "@/types/student";
import { Step } from "@/types/profile.types";


const ProfileHeader = ({ profile }: { profile: Profile }) => {
  const candidateType = profile.role === "student" ? (profile.candidate_type as CandidateType) : null;

  // 1. Determine required fields based on candidate type / role
  let requiredFields: (string | null | undefined)[] = [
    profile.first_name,
    profile.last_name,
    profile.email,
  ];

  if (profile.role === "student") {
    if (candidateType === "studying") {
      requiredFields.push(
        profile.degree_level,
        profile.university_name,
        profile.speciality,
        profile.academic_year,
        profile.speciality_type,
        profile.student_card_url,
        profile.student_id,
        profile.wilaya,
        profile.avatar_url,
        profile.resume_url
      );
    } else if (candidateType === "graduated") {
      requiredFields.push(
        profile.university_name,
        profile.degree_level, // the degree title
        profile.speciality,
        profile.graduation_year,
        profile.avatar_url,
        profile.resume_url,
        profile.wilaya
      );
    } else if (candidateType === "self_taught") {
      requiredFields.push(
        profile.avatar_url,
        profile.resume_url,
        profile.skills // assuming skills array is not empty
      );
    } else {
      // fallback for student without candidate_type (old accounts)
      requiredFields.push(
        profile.degree_level,
        profile.university_name,
        profile.speciality,
        profile.academic_year,
        profile.speciality_type,
        profile.student_card_url,
        profile.student_id,
        profile.wilaya,
        profile.avatar_url,
        profile.resume_url
      );
    }
  } else if (profile.role === "graduate") {
    // handle legacy graduate role if needed
    requiredFields.push(
      profile.university_name,
      profile.degree_level,
      profile.graduation_year,
      profile.avatar_url,
      profile.resume_url
    );
  } else {
    // For company/university admins or other roles, basic info + avatar + maybe other fields
    requiredFields.push(profile.avatar_url, profile.wilaya);
    if (profile.role === "company_admin") requiredFields.push(profile.company_name);
    if (profile.role === "university_admin") requiredFields.push(profile.university_name);
  }

  const filled = requiredFields.filter((f) => f && String(f).trim() !== "").length;
  const completeness = Math.round((filled / requiredFields.length) * 100);

  // 2. Build steps dynamically
  const basicInfoComplete = !!(profile.first_name && profile.last_name && profile.email);
  const documentsComplete = !!(profile.avatar_url && profile.resume_url);
  let steps: Step[] = [];

  // Step 0: Basic Info (always present)
  steps.push({
    id: "basic",
    title: "Basic Info",
    description: "Personal details",
    icon: <User className="h-4 w-4" />,
    status: basicInfoComplete ? "completed" : "current",
  });

  // Step 1: Academic / Professional details (depending on role)
  let academicComplete = false;
  if (profile.role === "student") {
    if (candidateType === "studying") {
      academicComplete = !!(
        profile.degree_level &&
        profile.university_name &&
        profile.speciality &&
        profile.academic_year &&
        profile.speciality_type
      );
    } else if (candidateType === "graduated") {
      academicComplete = !!(
        profile.university_name &&
        profile.degree_level &&
        profile.speciality &&
        profile.graduation_year
      );
    } else if (candidateType === "self_taught") {
      academicComplete = true; // no academic info required, but we might check skills length
    } else {
      academicComplete = false;
    }
  } else if (profile.role === "company_admin") {
    academicComplete = !!(profile.company_name && profile.wilaya);
  } else if (profile.role === "university_admin") {
    academicComplete = !!(profile.university_name && profile.wilaya);
  } else {
    academicComplete = false;
  }

  steps.push({
    id: "academic",
    title: profile.role === "student" && candidateType === "self_taught" ? "Skills & Portfolio" : "Professional Info",
    description: profile.role === "student" && candidateType === "self_taught" ? "Add your skills" : "Education / Work",
    icon: <GraduationCap className="h-4 w-4" />,
    status: basicInfoComplete
      ? academicComplete
        ? "completed"
        : "current"
      : "locked",
  });

  // Step 2: Documents (avatar, resume, student card for studying)
  const relevantDocsComplete = (() => {
    if (!documentsComplete) return false;
    if (profile.role === "student" && candidateType === "studying") {
      return !!(profile.student_card_url && profile.student_id);
    }
    return true;
  })();
  steps.push({
    id: "documents",
    title: "Documents",
    description: "CV & ID",
    icon: <FileText className="h-4 w-4" />,
    status: academicComplete
      ? relevantDocsComplete
        ? "completed"
        : "current"
      : "locked",
  });

  // Step 3: Admin Verification (only if required)
  const needsVerification = profile.role === "student" || profile.role === "graduate";
  if (needsVerification) {
    const allFieldsComplete = completeness === 100;
    steps.push({
      id: "admin-verification",
      title: "Verification",
      description: "Admin review",
      icon: <Shield className="h-4 w-4" />,
      status: allFieldsComplete
        ? profile.is_verified
          ? "completed"
          : "current"
        : "locked",
    });
  }

  // Step 4: University Connection (only for studying students)
  if (profile.role === "student" && candidateType === "studying") {
    const isVerified = profile.is_verified === true;
    steps.push({
      id: "university-connection",
      title: "Connection",
      description: "University link",
      icon: <LinkIcon className="h-4 w-4" />,
      status: isVerified
        ? profile.university_connection_status === "accepted"
          ? "completed"
          : "current"
        : "locked",
    });
  }

  // Final step: Ready (for all students and graduates)
  if (profile.role === "student" || profile.role === "graduate") {
    const isConnectedOrVerified = (() => {
      if (profile.role === "student" && candidateType === "studying") {
        return profile.university_connection_status === "accepted";
      }
      return profile.is_verified === true;
    })();
    steps.push({
      id: "certificate",
      title: "Ready",
      description: "Certificates",
      icon: <Award className="h-4 w-4" />,
      status: isConnectedOrVerified ? "completed" : "locked",
    });
  }

  // Determine current step index based on first incomplete/current step
  let currentStepIndex = steps.findIndex(step => step.status === "current");
  if (currentStepIndex === -1) currentStepIndex = steps.length - 1;

  // 3. Render
  return (
    <div className="space-y-5">
      {/* MAIN CARD (unchanged) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#639922]/10 blur-3xl" />

        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT SECTION (avatar & info) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 min-w-0">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-[#639922]"
                  />
                ) : (
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border-2 border-[#639922]/30 bg-[#639922]/10">
                    <UserCircle className="h-10 w-10 text-foreground/40" />
                  </div>
                )}
                {profile.is_verified && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-[#639922] border-2 border-[#0b0c0e] p-1">
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground break-words">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="mt-1 text-sm text-foreground/40 capitalize">
                  {profile.role}{profile.role === "student" && candidateType ? ` – ${candidateType}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#639922]/30 bg-[#639922]/10 px-3 py-1 text-xs text-[#639922]">
                    <Shield className="h-3 w-3" />
                    {profile.is_verified ? "Verified" : "Unverified"}
                  </span>
                  {profile.role === "student" && candidateType === "studying" && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                        profile.university_connection_status === "accepted"
                          ? "border-[#639922]/30 bg-[#639922]/10 text-[#639922]"
                          : "border-white/10 bg-white/5 text-foreground/40"
                      )}
                    >
                      <Building2 className="h-3 w-3" />
                      {profile.university_connection_status === "accepted" ? "Connected" : "Not Connected"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION – progress circle */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="text-foreground/10" stroke="currentColor" />
                  <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" stroke="currentColor" className="text-[#639922]"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * completeness) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-foreground">{completeness}%</span>
                  <span className="text-[10px] uppercase text-foreground/40">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JOURNEY */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
        <ProfileCompletionJourney steps={steps} />
      </div>
    </div>
  );
};

export default ProfileHeader;