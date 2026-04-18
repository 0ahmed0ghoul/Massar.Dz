import { useEffect, useState } from "react";
import { Tables } from "@/types/database";
import { studentService } from "../services/student.service";

type Job = Tables<"jobs">;

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    studentService.getJobs().then(setJobs);
  }, []);

  return { jobs };
};