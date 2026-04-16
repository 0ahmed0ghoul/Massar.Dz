const RecentApplications = ({ applications = [] }) => {
  if (!applications.length) return null;

  return (
    <div>
      <h2 className="text-white mb-2">Recent Applications</h2>
      {applications.slice(0, 5).map((app) => (
        <div key={app.id} className="p-3 border rounded">
          <p className="text-white">{app.jobs?.title || "Unknown Job"}</p>
          <p className="text-white/40 text-xs">{app.jobs?.company || "Unknown Company"}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentApplications;