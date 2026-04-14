const ActivityTimeline = ({ activities }: { activities: any[] }) => {
    return (
      <div>
        <h2 className="text-white">Activity</h2>
  
        {activities.map((a, i) => (
          <div key={i} className="text-sm text-white/60">
            {a.action}
          </div>
        ))}
      </div>
    );
  };
  
  export default ActivityTimeline;