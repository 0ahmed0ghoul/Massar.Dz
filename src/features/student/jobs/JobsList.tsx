// components/jobs/JobsList.tsx
import { useJobs } from "../hooks/useJobs";

const JobsList = () => {
  const { jobs } = useJobs();

  if (!jobs.length) {
    return <div className="text-foreground/40">No jobs available</div>;
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-foreground">{job.title}</h3>
              <p className="text-sm text-foreground/60">{job.company}</p>
            </div>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {job.job_type}
            </span>
          </div>
          <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{job.description}</p>
          <div className="flex gap-4 mt-3 text-xs text-foreground/50">
            <span>📍 {job.wilaya}</span>
            {job.salary_min && job.salary_max && (
              <span>💰 {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} DA</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList;