const RecentApplications = ({ applications }: { applications: any[] }) => {
    return (
      <div>
        <h2 className="text-white mb-2">Recent Applications</h2>
  
        {applications.map((app) => (
          <div key={app.id} className="p-3 border rounded">
            <p className="text-white">{app.title}</p>
            <p className="text-white/40 text-xs">{app.company}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default RecentApplications;