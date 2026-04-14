const RecommendedJobs = ({ jobs }: { jobs: any[] }) => {
    return (
      <div>
        <h2 className="text-white mb-2">Recommended Jobs</h2>
  
        {jobs.map((job) => (
          <div key={job.id} className="p-3 border rounded">
            <p className="text-white">{job.title}</p>
            <p className="text-white/40 text-xs">{job.company}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default RecommendedJobs;