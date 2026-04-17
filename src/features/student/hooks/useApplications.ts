import { useEffect, useState } from "react";
import { Tables } from "@/types/database";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "@/features/student copy/services/student.service";

type Application = Tables<"applications">;

// Extended type that includes the joined job data
type ApplicationWithJob = Application & {
  jobs: {
    id: string;
    title: string;
    company: string;
  } | null;
};

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);

  useEffect(() => {
    if (!user) return;

    studentService.getApplications(user.id).then((data) => {
      // Type assertion since the service returns the joined data
      setApplications(data as ApplicationWithJob[]);
    });
  }, [user]);

  return { applications };
};