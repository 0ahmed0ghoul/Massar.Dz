// features/company/hooks/usePublicCompanyProfile.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "../service/job.service";
import { companyProfileService } from "../service/companyProfile.service";
import { Job } from "@/types/job";
import { mapJob } from "@/mapper/job.mapper";
import { PublicCompanyProfile } from "@/types/company";

export function usePublicCompanyProfile(companyId: string) {
  const [company, setCompany] = useState<PublicCompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [profile, jobList] = await Promise.all([
          companyProfileService.getPublicProfile(companyId),
          jobService.getJobsByCompany(companyId),
        ]);
        setCompany(profile);
        const mapped = jobList.map(mapJob);
        setJobs(mapped);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [companyId, toast]);

  return { company, jobs, loading };
}
