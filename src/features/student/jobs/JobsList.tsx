import { useJobs } from "../hooks/useJobs";

const JobsList = () => {
  const { jobs } = useJobs();

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="border p-3 rounded">
          <p>{job.title}</p>
        </div>
      ))}
    </div>
  );
};

export default JobsList;