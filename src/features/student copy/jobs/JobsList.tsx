import { useJobs } from "../hooks/useJobs";

const JobsList = () => {
  const { jobs } = useJobs();

  if (!jobs.length) {
    return <div className="text-white/40">No jobs available</div>;
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="border p-3 rounded">
          <p className="text-white">{job.title}</p>
          <p className="text-white/40 text-xs">{job.company}</p>
        </div>
      ))}
    </div>
  );
};

export default JobsList;