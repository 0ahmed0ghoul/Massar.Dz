// ActivityTimeline.tsx
const ActivityTimeline = ({ activities = [] }) => {
  // Mock data (will be used if activities prop is empty)
  const mockActivities = [
    { action: "Profile was viewed by Google Recruiter", date: "2024-03-15" },
    { action: "Application submitted for 'Frontend Developer'", date: "2024-03-14" },
    { action: "Completed skill assessment: React", date: "2024-03-12" },
    { action: "Added new certificate: AWS Cloud Practitioner", date: "2024-03-10" },
    { action: "Updated profile picture", date: "2024-03-08" },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <h2 className="mb-6 text-lg font-bold text-foreground">Activity Feed</h2>
      <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-white/10">
        {displayActivities.map((a, i) => (
          <div key={i} className="relative pl-6">
            <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0b0c0e] bg-[#639922] shadow-[0_0_8px_#639922]" />
            <p className="text-sm font-medium text-foreground/80">{a.action}</p>
            <p className="text-[11px] text-foreground/30">
              {new Date(a.date || Date.now()).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;