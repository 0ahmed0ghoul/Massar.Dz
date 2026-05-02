// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export interface Notification {
  id: string;
  title: string;
  description: string;
  actionLink: string;
  type: "warning" | "info" | "success";
}

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

      // ------------------------------------------------------------------
      // 1. Missing required fields (existing logic)
      // ------------------------------------------------------------------
      const missingFields: { field: string; label: string; link: string }[] = [];

      const commonFields = [
        { field: "first_name", label: "First name", link: "/student/dashboard/profile" },
        { field: "last_name", label: "Last name", link: "/student/dashboard/profile" },
        { field: "email", label: "Email address", link: "/student/dashboard/profile" },
        { field: "wilaya", label: "Wilaya (State)", link: "/student/dashboard/profile" },
      ];

      const studentFields = [
        { field: "degree_level", label: "Degree level", link: "/student/dashboard/profile" },
        { field: "university_name", label: "University name", link: "/student/dashboard/profile" },
        { field: "speciality", label: "speciality", link: "/student/dashboard/profile" },
        { field: "avatar_url", label: "Profile picture", link: "/student/dashboard/profile" },
        { field: "resume_url", label: "CV / Resume", link: "/student/dashboard/profile" },
      ];

      let fieldsToCheck: { field: string; label: string; link: string }[] = [...commonFields];

      if (profile.role === "student") {
        fieldsToCheck.push(...studentFields);
      } else if (profile.role === "company_admin") {
        fieldsToCheck.push(
          { field: "company_name", label: "Company name", link: "/dashboard/company/profile" },
          { field: "avatar_url", label: "Logo", link: "/dashboard/company/profile" }
        );
      } else if (profile.role === "university_admin") {
        fieldsToCheck.push(
          { field: "university_name", label: "University name", link: "/university/dashboard/profile" },
          { field: "avatar_url", label: "Logo", link: "/university/dashboard/profile" }
        );
      }

      for (const { field, label, link } of fieldsToCheck) {
        const value = profile[field as keyof typeof profile];
        const isEmpty = !value || (typeof value === "string" && value.trim() === "");
        if (isEmpty && field !== "resume_url" && field !== "avatar_url") { // make resume/avatar optional in notifications
          missingFields.push({ field, label, link });
        }
      }

      for (const m of missingFields) {
        notifs.push({
          id: `missing-${m.field}`,
          title: `Missing ${m.label}`,
          description: `Please add your ${m.label.toLowerCase()} to complete your profile.`,
          actionLink: m.link,
          type: "warning",
        });
      }

      // ------------------------------------------------------------------
      // 2. Profile completion → waiting for verification
      // ------------------------------------------------------------------
      const isProfileComplete = profile.is_completed === true;
      const verificationStatus = profile.status; // 'pending', 'approved', 'rejected', null
      const universityConnectionStatus = profile.university_connection_status; // 'pending', 'connected', null

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
      if (verificationStatus === 'approved' && !universityConnectionStatus) {
        notifs.push({
          id: "verification-approved-invitation-sent",
          title: "Account Verified & Invitation Sent",
          description: "🎉 Massar team has verified your account. You now have a legitimate student profile. A connection invitation has been sent to your university. Waiting for their approval.",
          actionLink: "/student/dashboard",
          type: "success",
        });
      }

      // ------------------------------------------------------------------
      // 4. (Optional) University connection approved
      // ------------------------------------------------------------------
      if (universityConnectionStatus) {
        notifs.push({
          id: "university-connected",
          title: "University Connected!",
          description: "🏫 Your university has approved the connection. You can now access certificates and other university features.",
          actionLink: "/student/dashboard",
          type: "success",
        });
      }

      // Optional: add a notification when the profile completeness is low (below 50%)
      const filledFields = fieldsToCheck.length - missingFields.length;
      const completeness = (filledFields / fieldsToCheck.length) * 100;
      if (completeness < 50 && missingFields.length > 0) {
        notifs.push({
          id: "low-completeness",
          title: "Profile almost empty!",
          description: `Your profile is only ${Math.round(completeness)}% complete. Complete it to get better job matches.`,
          actionLink: "/student/dashboard/profile",
          type: "info",
        });
      }

      // Sort notifications: warnings first → info → success
      notifs.sort((a, b) => {
        const order = { warning: 0, info: 1, success: 2 };
        return (order[a.type] || 0) - (order[b.type] || 0);
      });

      setNotifications(notifs);
      setLoading(false);
    };

    checkNotifications();
  }, [user, profile]);

  return { notifications, loading };
};