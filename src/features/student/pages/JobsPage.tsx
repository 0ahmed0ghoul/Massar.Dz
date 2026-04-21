import JobsList from "../jobs/JobsList";

const JobsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Recommended Jobs</h1>
      <JobsList />
    </div>
  );
};

export default JobsPage;