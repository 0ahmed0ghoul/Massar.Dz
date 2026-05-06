// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Notification } from "@/types/notification";

export const useNotifications = () => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkNotifications = async () => {
      if (!user || !profile) {
        setLoading(false);
        return;
      }

      const notifs: Notification[] = [];

      // Determine student subtype
      const candidateType = profile.role === "student" ? profile.candidate_type : null;
      const isStudying = candidateType === "studying";
      const isGraduated = candidateType === "graduated";
      const isSelfTaught = candidateType === "self_taught";

      // ------------------------------------------------------------------
      // 1. Missing required fields (based on subtype)
      // ------------------------------------------------------------------
      const missingFields: { field: string; label: string; link: string }[] = [];

      const commonFields = [
        { field: "first_name", label: "First name", link: "/student/dashboard/profile" },
        { field: "last_name", label: "Last name", link: "/student/dashboard/profile" },
        { field: "email", label: "Email address", link: "/student/dashboard/profile" },
        { field: "wilaya", label: "Wilaya (State)", link: "/student/dashboard/profile" },
      ];

      let fieldsToCheck: { field: string; label: string; link: string }[] = [...commonFields];

      if (profile.role === "student") {
        // Always require avatar and resume
        const avatarResume = [
          { field: "avatar_url", label: "Profile picture", link: "/student/dashboard/profile" },
          { field: "resume_url", label: "CV / Resume", link: "/student/dashboard/profile" },
        ];
        fieldsToCheck.push(...avatarResume);

        if (isStudying) {
          fieldsToCheck.push(
            { field: "degree_level", label: "Degree level", link: "/student/dashboard/profile" },
            { field: "university_name", label: "University name", link: "/student/dashboard/profile" },
            { field: "speciality", label: "Speciality", link: "/student/dashboard/profile" },
            { field: "academic_year", label: "Academic year", link: "/student/dashboard/profile" },
            { field: "speciality_type", label: "Speciality type", link: "/student/dashboard/profile" },
            { field: "student_id", label: "Student ID", link: "/student/dashboard/profile" },
            { field: "student_card_url", label: "Student card", link: "/student/dashboard/profile" },
          );
        } else if (isGraduated) {
          fieldsToCheck.push(
            { field: "university_name", label: "University name", link: "/student/dashboard/profile" },
            { field: "degree_level", label: "Degree title", link: "/student/dashboard/profile" },
            { field: "speciality", label: "Speciality", link: "/student/dashboard/profile" },
            { field: "graduation_year", label: "Graduation year", link: "/student/dashboard/profile" },
          );
        } else if (isSelfTaught) {
          // Only require skills (we'll treat as part of fieldsToCheck)
          fieldsToCheck.push(
            { field: "skills", label: "Skills", link: "/student/dashboard/skills" },
          );
        }
      } else if (profile.role === "company_admin") {
        fieldsToCheck.push(
          { field: "company_name", label: "Company name", link: "/dashboard/company/profile" },
          { field: "avatar_url", label: "Logo", link: "/dashboard/company/profile" },
        );
      } else if (profile.role === "university_admin") {
        fieldsToCheck.push(
          { field: "university_name", label: "University name", link: "/university/dashboard/profile" },
          { field: "avatar_url", label: "Logo", link: "/university/dashboard/profile" },
        );
      }

      for (const { field, label, link } of fieldsToCheck) {
        const value = profile[field as keyof typeof profile];
        let isEmpty = false;
        if (field === "skills") {
          // skills is an array; check if empty
          isEmpty = !value || (Array.isArray(value) && value.length === 0);
        } else {
          isEmpty = !value || (typeof value === "string" && value.trim() === "");
        }
        if (isEmpty) {
          missingFields.push({ field, label, link });
        }
      }

      for (const m of missingFields) {
        // Avoid duplicate fields (in case of overlapping)
        if (!notifs.some(n => n.id === `missing-${m.field}`)) {
          notifs.push({
            id: `missing-${m.field}`,
            title: `Missing ${m.label}`,
            description: `Please add your ${m.label.toLowerCase()} to complete your profile.`,
            actionLink: m.link,
            type: "warning",
          });
        }
      }

      // Skip further university‑related notifications if not studying
      if (profile.role === "student" && isStudying) {
        // ------------------------------------------------------------------
        // 2. Profile completion → waiting for verification
        // ------------------------------------------------------------------
        const isProfileComplete = profile.is_completed === true;
        const verificationStatus = profile.status;

        if (isProfileComplete && (verificationStatus === 'pending' || verificationStatus === null)) {
          notifs.push({
            id: "verification-pending",
            title: "Profile Submitted for Verification",
            description: "✅ Your profile is now complete. Massar team will verify your information. If it's legitimate, we will send a connection invitation to your university.",
            actionLink: "/student/dashboard",
            type: "info",
          });
        }

        // ------------------------------------------------------------------
        // 3. Account verified & invitation sent to university
        // ------------------------------------------------------------------
        const universityConnectionStatus = profile.university_connection_status;
        if (verificationStatus === 'approved' && !universityConnectionStatus) {
          notifs.push({
            id: "verification-approved-invitation-sent",
            title: "Account Verified & Invitation Sent",
            description: "🎉 Massar team has verified your account. A connection invitation has been sent to your university. Waiting for their approval.",
            actionLink: "/student/dashboard",
            type: "success",
          });
        }

        // ------------------------------------------------------------------
        // 4. University connection approved
        // ------------------------------------------------------------------
        if (universityConnectionStatus === 'accepted') {
          notifs.push({
            id: "university-connected",
            title: "University Connected!",
            description: "🏫 Your university has approved the connection. You can now access certificates and other university features.",
            actionLink: "/student/dashboard",
            type: "success",
          });
        }
      }

      // Optional: add a low‑completeness notification (only if missing fields exist)
      const filledCount = fieldsToCheck.length - missingFields.length;
      const completeness = fieldsToCheck.length > 0 ? (filledCount / fieldsToCheck.length) * 100 : 100;
      if (missingFields.length > 0 && completeness < 50) {
        if (!notifs.some(n => n.id === "low-completeness")) {
          notifs.push({
            id: "low-completeness",
            title: "Profile almost empty!",
            description: `Your profile is only ${Math.round(completeness)}% complete. Complete it to get better opportunities.`,
            actionLink: profile.role === "student" ? "/student/dashboard/profile" : "/dashboard/company/profile",
            type: "info",
          });
        }
      }

      // Sort notifications: warnings first → info → success
      notifs.sort((a, b) => {
        const order = { warning: 0, info: 1, success: 2 };
        return (order[a.type] || 0) - (order[b.type] || 0);
      });

      // Remove potential duplicates (e.g., same missing field might appear twice? we already deduped)
      setNotifications(notifs);
      setLoading(false);
    };

    checkNotifications();
  }, [user, profile]);

  return { notifications, loading };
};