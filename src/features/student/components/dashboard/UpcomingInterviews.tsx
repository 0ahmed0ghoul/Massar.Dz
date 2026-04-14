const UpcomingInterviews = ({ interviews }: { interviews: any[] }) => {
    return (
      <div>
        <h2 className="text-white">Interviews</h2>
  
        {interviews.map((i) => (
          <div key={i.id} className="text-sm text-white/60">
            {i.role} - {i.company}
          </div>
        ))}
      </div>
    );
  };
  
  export default UpcomingInterviews;