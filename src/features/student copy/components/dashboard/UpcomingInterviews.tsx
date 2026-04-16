const UpcomingInterviews = ({ interviews = [] }) => {
  if (!interviews.length) {
    return <div className="text-white/40">No upcoming interviews</div>;
  }

  return (
    <div>
      <h2 className="text-white mb-2">Interviews</h2>
      {interviews.map((i) => (
        <div key={i.id} className="text-sm text-white/60">
          {i.role} at {i.company} – {i.date ? new Date(i.date).toLocaleDateString() : "Date TBD"}
        </div>
      ))}
    </div>
  );
};

export default UpcomingInterviews;