// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "@/features/student/services/student.service";

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
    const checkProfileCompleteness = async () => {
      if (!user || !profile) {
        setLoading(false);
        return;
      }

      const missingFields: { field: string; label: string; link: string }[] = [];

      // Define required fields based on role
      const commonFields = [
        { field: "first_name", label: "First name", link: "/dashboard/student/profile" },
        { field: "last_name", label: "Last name", link: "/dashboard/student/profile" },
        { field: "email", label: "Email address", link: "/dashboard/student/profile" },
        { field: "wilaya", label: "Wilaya (State)", link: "/dashboard/student/profile" },
      ];

      const studentFields = [
        { field: "degree_level", label: "Degree level", link: "/dashboard/student/profile" },
        { field: "university_name", label: "University name", link: "/dashboard/student/profile" },
        { field: "specialty", label: "Specialty / Major", link: "/dashboard/student/profile" },
        { field: "avatar_url", label: "Profile picture", link: "/dashboard/student/profile" },
        { field: "resume_url", label: "CV / Resume", link: "/dashboard/student/profile" },
      ];

      const employerFields = [
        { field: "company_name", label: "Company name", link: "/dashboard/company/profile" },
        { field: "avatar_url", label: "Logo", link: "/dashboard/company/profile" },
      ];

      const universityFields = [
        { field: "university_name", label: "University name", link: "/dashboard/university/profile" },
        { field: "avatar_url", label: "Logo", link: "/dashboard/university/profile" },
      ];

      let fieldsToCheck = [...commonFields];

      if (profile.role === "student") {
        fieldsToCheck.push(...studentFields);
      } else if (profile.role === "company_admin") {
        fieldsToCheck.push(...employerFields);
      } else if (profile.role === "pending_university") {
        fieldsToCheck.push(...universityFields);
      }

      // Check each field
      for (const { field, label, link } of fieldsToCheck) {
        const value = profile[field as keyof typeof profile];
        const isEmpty = !value || (typeof value === "string" && value.trim() === "");
        if (isEmpty) {
          missingFields.push({ field, label, link });
        }
      }

      // Build notifications
      const notifs: Notification[] = missingFields.map((f, idx) => ({
        id: `missing-${f.field}-${idx}`,
        title: `Missing ${f.label}`,
        description: `Your profile is incomplete. Please add your ${f.label.toLowerCase()} to improve your chances.`,
        actionLink: f.link,
        type: "warning",
      }));

      // Add a special notification if profile completeness is below 50%
      const totalFields = fieldsToCheck.length;
      const filledFields = totalFields - missingFields.length;
      const completeness = Math.round((filledFields / totalFields) * 100);
      if (completeness < 50 && missingFields.length > 0) {
        notifs.unshift({
          id: "low-completeness",
          title: "Profile almost empty!",
          description: `Your profile is only ${completeness}% complete. Complete it to get better job matches.`,
          actionLink: "/dashboard/student/profile",
          type: "info",
        });
      }

      setNotifications(notifs);
      setLoading(false);
    };

    checkProfileCompleteness();
  }, [user, profile]);

  return { notifications, loading };
};