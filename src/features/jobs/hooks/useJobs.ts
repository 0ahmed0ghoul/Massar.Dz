import { jobService } from '@/features/company/service/job.service';
import { Job } from '@/types/job';
import { useState, useEffect } from 'react';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await jobService
        .getActiveJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  return { jobs, loading };
}