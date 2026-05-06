import { Link } from "react-router-dom";

// RecentApplications.tsx
const RecentApplications = ({ applications = [] }) => {
  // Mock data (will be used if applications prop is empty)
  const mockApplications = [
    { id: 1, jobs: { title: "", company: "", location: "" }, status: "Applied", date: "2024-03-14" },
  ];

  const displayApplications = applications.length > 0 ? applications : mockApplications;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Recent Applications</h2>
              <Link to="/student/dashboard/experience" className="text-xs text-[#639922] hover:text-[#7ab33e]">
                View all →
              </Link>      </div>

      <div className="space-y-3">
        {displayApplications.slice(0, 4).map((app) => (
          <div key={app.id} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] font-bold text-foreground">
                {app.jobs?.company?.[0] || "J"}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{app.jobs?.title || "Position"}</p>
                <p className="text-xs text-foreground/40">{app.jobs?.company || "Company"}</p>
              </div>
            </div>
            <span className="rounded-full bg-[#639922]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-[#639922]">
              {app.status || "Applied"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;