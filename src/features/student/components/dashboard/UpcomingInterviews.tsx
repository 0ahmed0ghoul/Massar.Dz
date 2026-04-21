// UpcomingInterviews.tsx
import { Calendar, Video } from "lucide-react";

const UpcomingInterviews = ({ interviews = [] }) => {
  // Mock data (will be used if interviews prop is empty)
  const mockInterviews = [
    { id: 1, role: "Frontend Developer", company: "Google", date: "2024-03-20T10:00:00", type: "video" },
    { id: 2, role: "Software Engineer", company: "Microsoft", date: "2024-03-22T14:30:00", type: "video" },
    { id: 3, role: "Product Designer", company: "Apple", date: "2024-03-25T11:00:00", type: "video" },
  ];

  const displayInterviews = interviews.length > 0 ? interviews : mockInterviews;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <h2 className="mb-6 text-lg font-bold text-foreground">Upcoming Interviews</h2>
      <div className="space-y-4">
        {displayInterviews.length > 0 ? (
          displayInterviews.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-xl border border-white/[0.05] bg-white/[0.03] p-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#639922]/20 text-[#639922]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{i.role}</p>
                <p className="text-xs text-foreground/40">{i.company}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-[#639922]">
                  <Video className="h-3 w-3" />
                  <span>
                    {i.date
                      ? new Date(i.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Meeting Link Sent"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">
              No sessions scheduled
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;