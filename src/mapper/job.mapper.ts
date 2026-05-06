import { Job as ApiJob } from "@/features/company/service/job.service";
import { Job } from "@/types/job";


export function mapJob(apiJob: ApiJob): Job {
  return {
    id: apiJob.id,
    title: apiJob.title,
    companyId: apiJob.company_id,
    type: apiJob.job_type,
    experience: apiJob.experience_level,
    postedAt: apiJob.created_at,
    active: apiJob.status === "active",
  };
}