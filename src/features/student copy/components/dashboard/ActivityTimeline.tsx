const ActivityTimeline = ({ activities = [] }) => {
  if (!activities.length) {
    return <div className="text-white/40">No recent activity</div>;
  }

  return (
    <div>
      <h2 className="text-white mb-2">Activity</h2>
      {activities.map((a, i) => (
        <div key={i} className="text-sm text-white/60">
          {a.action}
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;