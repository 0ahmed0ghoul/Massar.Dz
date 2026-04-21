// components/applications/ApplicationsList.tsx
import { useApplications } from "../hooks/useApplications";

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-500/10 text-green-500";
    case "rejected":
      return "bg-red-500/10 text-red-500";
    case "reviewed":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-yellow-500/10 text-yellow-500";
  }
};

const ApplicationsList = () => {
  const { applications } = useApplications();

  if (!applications?.length) {
    return <div className="text-foreground/50 text-sm">No applications yet.</div>;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="border p-4 rounded-lg bg-black/20 hover:bg-black/30 transition">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {app.jobs?.title || `Job ID: ${app.job_id}`}
              </p>
              <p className="text-foreground/40 text-xs">
                {app.jobs?.company || "Unknown company"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {app.match_score !== undefined && app.match_score > 0 && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {app.match_score}% match
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(app.status || "pending")}`}>
                {app.status || "pending"}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-foreground/30">
            Applied: {new Date(app.created_at || "").toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsList;