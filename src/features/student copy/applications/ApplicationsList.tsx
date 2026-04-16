import { useApplications } from "../hooks/useApplications";

const ApplicationsList = () => {
  const { applications } = useApplications();

  if (!applications?.length) {
    return <div className="text-white/50 text-sm">No applications yet.</div>;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="border p-3 rounded bg-black/20">
          <p className="text-white text-sm font-medium">
            {app.jobs?.title || `Job ID: ${app.job_id}`}
          </p>
          <p className="text-white/40 text-xs">
            Status: {app.status || "pending"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsList;