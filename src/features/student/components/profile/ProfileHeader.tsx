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
  Crown,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCompletionJourney } from "../ProfileCompletionJourney";
import { CandidateType, Profile } from "@/types/student";
import { Step } from "@/types/profile.types";

const ProfileHeader = ({ profile }: { profile: Profile }) => {
  // Only student role has candidate_type
  const candidateType = profile.role === "student" ? (profile.candidate_type as CandidateType) : null;
  const isStudying = candidateType === "studying";
  const isGraduated = candidateType === "graduated";
  const isSelfTaught = candidateType === "self_taught";

  // Plan status helpers
  const planType = profile.plan_type || "free";
  const planStatus = profile.plan_status || "inactive";
  const isActive = planStatus === "active";
  const isPremium = planType === "premium" && isActive;
  const isBasic = planType === "basic" && isActive;
  const isPending = planStatus === "pending";
  const isRejected = planStatus === "rejected";
  const hasActivePlan = isActive && (isPremium || isBasic);

  // Get plan display info
  const getPlanDisplay = () => {
    if (!isActive) {
      if (isPending) return { label: "Pending Approval", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", icon: Clock };
      if (isRejected) return { label: "Payment Rejected", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", icon: AlertCircle };
      return { label: "Free", color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/30", icon: Award };
    }
    if (isPremium) return { label: "Premium", color: "text-[#639922]", bg: "bg-[#639922]/10", border: "border-[#639922]/30", icon: Crown };
    if (isBasic) return { label: "Basic", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", icon: Shield };
    return { label: "Free", color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/30", icon: Award };
  };

  const planDisplay = getPlanDisplay();
  const PlanIcon = planDisplay.icon;

  // ----- Required fields for completeness calculation -----
  let requiredFields: (string | null | undefined)[] = [
    profile.first_name,
    profile.last_name,
    profile.email,
  ];

  if (profile.role === "student") {
    if (isStudying) {
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
    } else if (isGraduated) {
      requiredFields.push(
        profile.university_name,
        profile.degree_level,
        profile.speciality,
        profile.graduation_year,
        profile.avatar_url,
        profile.resume_url,
        profile.wilaya
      );
    } else if (isSelfTaught) {
      requiredFields.push(
        profile.avatar_url,
        profile.resume_url,
        profile.skills  // ensure skills array is not empty
      );
    }
  } else if (profile.role === "graduate") {
    requiredFields.push(
      profile.university_name,
      profile.degree_level,
      profile.graduation_year,
      profile.avatar_url,
      profile.resume_url
    );
  } else {
    // For company/university admins
    requiredFields.push(profile.avatar_url, profile.wilaya);
    if (profile.role === "company_admin") requiredFields.push(profile.company_name);
    if (profile.role === "university_admin") requiredFields.push(profile.university_name);
  }

  const filled = requiredFields.filter((f) => f && String(f).trim() !== "").length;
  const completeness = Math.round((filled / requiredFields.length) * 100);
  
  // ----- Build steps dynamically -----
  let steps: Step[] = [];

  // Step 0: Basic Info
  const basicInfoComplete = !!(profile.first_name && profile.last_name && profile.email);
  steps.push({
    id: "basic",
    title: "Basic Info",
    description: "Personal details",
    icon: <User className="h-4 w-4" />,
    status: basicInfoComplete ? "completed" : "current",
  });

  // Step 1: Academic / Professional details
  let academicComplete = false;
  if (profile.role === "student") {
    if (isStudying) {
      academicComplete = !!(
        profile.degree_level &&
        profile.university_name &&
        profile.speciality &&
        profile.academic_year &&
        profile.speciality_type
      );
    } else if (isGraduated) {
      academicComplete = !!(
        profile.university_name &&
        profile.degree_level &&
        profile.speciality &&
        profile.graduation_year
      );
    } else if (isSelfTaught) {
      // No academic info required, but we can consider it "complete" if skills are present
      academicComplete = Array.isArray(profile.skills) && profile.skills.length > 0;
    }
  } else if (profile.role === "company_admin") {
    academicComplete = !!(profile.company_name && profile.wilaya);
  } else if (profile.role === "university_admin") {
    academicComplete = !!(profile.university_name && profile.wilaya);
  }

  steps.push({
    id: "academic",
    title: isSelfTaught ? "Skills & Portfolio" : "Professional Info",
    description: isSelfTaught ? "Add your skills" : "Education / Work",
    icon: <GraduationCap className="h-4 w-4" />,
    status: basicInfoComplete
      ? academicComplete
        ? "completed"
        : "current"
      : "locked",
  });

  // Step 2: Documents (avatar, resume, student card for studying)
  const documentsComplete = !!(profile.avatar_url && profile.resume_url);
  const relevantDocsComplete = (() => {
    if (!documentsComplete) return false;
    if (isStudying) {
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

  // Step 3: Admin Verification – for all students
  const needsAdminVerification = isStudying || isGraduated || isSelfTaught;
  if (needsAdminVerification) {
    const allPreviousComplete = basicInfoComplete && academicComplete && relevantDocsComplete;
    steps.push({
      id: "admin-verification",
      title: "Verification",
      description: "Admin review",
      icon: <Shield className="h-4 w-4" />,
      status: allPreviousComplete
        ? profile.is_verified
          ? "completed"
          : "current"
        : "locked",
    });
  }

  // Step 4: University Connection – only for studying
  if (isStudying) {
    const allPreviousComplete = basicInfoComplete && academicComplete && relevantDocsComplete && profile.is_verified;
    steps.push({
      id: "university-connection",
      title: "Connection",
      description: "University link",
      icon: <LinkIcon className="h-4 w-4" />,
      status: allPreviousComplete
        ? profile.university_connection_status === "connected"
          ? "completed"
          : "current"
        : "locked",
    });
  }

  // Step 5: Ready (for all students and graduates)
  if (profile.role === "student" || profile.role === "graduate") {
    let readyCompleted = false;

    if (isStudying) {
      readyCompleted =
        profile.university_connection_status === "connected";
    } else if (isGraduated || isSelfTaught) {
      readyCompleted = profile.is_verified === true;
    }

    steps.push({
      id: "certificate",
      title: "Ready",
      description: "Certificates",
      icon: <Award className="h-4 w-4" />,
      status: readyCompleted ? "completed" : "locked",
    });
  } else if (profile.role === "company_admin" || profile.role === "university_admin") {
    // For company/university, add final step when approved
    const readyCompleted = profile.is_verified === true;
    steps.push({
      id: "ready",
      title: "Ready",
      description: "Account approved",
      icon: <Award className="h-4 w-4" />,
      status: readyCompleted ? "completed" : "locked",
    });
  }

  // Determine current step index (first step with status "current")
  let currentStepIndex = steps.findIndex(step => step.status === "current");
  if (currentStepIndex === -1 && steps.length > 0) currentStepIndex = steps.length - 1;

  // ----- Render -----
  return (
    <div className="space-y-5">
      {/* MAIN CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#639922]/10 blur-3xl" />

        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT SECTION */}
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
                  {profile.role}
                  {profile.role === "student" && candidateType ? ` – ${candidateType}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#639922]/30 bg-[#639922]/10 px-3 py-1 text-xs text-[#639922]">
                    <Shield className="h-3 w-3" />
                    {profile.is_verified ? "Verified" : "Unverified"}
                  </span>
                  
                  {/* Plan Badge - Updated to use new plan_type and plan_status */}
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    planDisplay.border,
                    planDisplay.bg,
                    planDisplay.color
                  )}>
                    <PlanIcon className="h-3 w-3" />
                    {planDisplay.label}
                  </span>

                  {isStudying && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                        profile.university_connection_status === "connected"
                          ? "border-[#639922]/30 bg-[#639922]/10 text-[#639922]"
                          : "border-white/10 bg-white/5 text-foreground/40"
                      )}
                    >
                      <Building2 className="h-3 w-3" />
                      {profile.university_connection_status === "connected" ? "Connected" : "Not Connected"}
                    </span>
                  )}
                </div>

                {/* Plan Status Message for pending/rejected */}
                {isPending && (
                  <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-2 text-center sm:text-left">
                    <p className="text-xs text-amber-400 flex items-center justify-center sm:justify-start gap-2">
                      <Clock className="h-3 w-3" />
                      Your payment is being reviewed. Premium features will be activated once approved.
                    </p>
                  </div>
                )}

                {isRejected && (
                  <div className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 p-2 text-center sm:text-left">
                    <p className="text-xs text-red-400 flex items-center justify-center sm:justify-start gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Your payment was rejected. Please contact support or submit a new payment request.
                    </p>
                  </div>
                )}

                {/* Plan Features Info */}
                {isActive && (
                  <div className="mt-3 text-center sm:text-left">
                    <p className="text-xs text-foreground/50">
                      {isPremium && (
                        <span className="inline-flex items-center gap-1">
                          <Crown className="h-3 w-3 text-[#639922]" />
                          Unlimited applications • AI matching • Priority support
                        </span>
                      )}
                      {isBasic && (
                        <span className="inline-flex items-center gap-1">
                          <Shield className="h-3 w-3 text-blue-400" />
                          Up to 10 applications/month • Basic matching
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SECTION – Progress Circle */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    strokeWidth="8"
                    fill="none"
                    className="text-foreground/10"
                    stroke="currentColor"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    strokeWidth="8"
                    fill="none"
                    stroke="currentColor"
                    className="text-[#639922]"
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

      {/* JOURNEY COMPONENT */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
        <ProfileCompletionJourney steps={steps} />
      </div>
    </div>
  );
};

export default ProfileHeader;