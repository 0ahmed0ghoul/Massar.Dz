// RecentApplications.tsx
const RecentApplications = ({ applications = [] }) => {
  // Mock data (will be used if applications prop is empty)
  const mockApplications = [
    { id: 1, jobs: { title: "Frontend Developer", company: "Google", location: "Mountain View, CA" }, status: "Applied", date: "2024-03-14" },
    { id: 2, jobs: { title: "Software Engineer", company: "Microsoft", location: "Redmond, WA" }, status: "Interview", date: "2024-03-12" },
    { id: 3, jobs: { title: "Product Designer", company: "Apple", location: "Cupertino, CA" }, status: "Reviewed", date: "2024-03-10" },
    { id: 4, jobs: { title: "Data Analyst", company: "Amazon", location: "Seattle, WA" }, status: "Applied", date: "2024-03-08" },
  ];

  const displayApplications = applications.length > 0 ? applications : mockApplications;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Recent Applications</h2>
        <button className="text-xs font-semibold text-[#639922] hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {displayApplications.slice(0, 4).map((app) => (
          <div key={app.id} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] font-bold text-white">
                {app.jobs?.company?.[0] || "J"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{app.jobs?.title || "Position"}</p>
                <p className="text-xs text-white/40">{app.jobs?.company || "Company"}</p>
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