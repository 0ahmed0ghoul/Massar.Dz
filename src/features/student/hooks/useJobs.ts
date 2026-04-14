import { useEffect, useState } from "react";
import { studentService } from "../services/student.service";
import { Tables } from "@/types/database";

type Job = Tables<"jobs">;

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    studentService.getJobs().then(setJobs);
  }, []);

  return { jobs };
};