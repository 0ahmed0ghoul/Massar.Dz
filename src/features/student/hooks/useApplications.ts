import { useEffect, useState } from "react";
import { studentService } from "../services/student.service";
import { Tables } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

type Application = Tables<"applications">;

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;

    studentService.getApplications(user.id).then(setApplications);
  }, [user]);

  return { applications };
};