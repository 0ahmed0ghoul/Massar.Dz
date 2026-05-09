import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
const RecentApplications = ({ applications = [] }) => {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Recent Applications</h2>
        <Link
          to="/student/dashboard/experience"
          className="text-xs text-[#639922] hover:text-[#7ab33e]"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {applications.slice(0, 4).map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-full border border-white/10">
                          {app.job?.company?.avatar_url ? (
                            <AvatarImage
                              src={app.job.company.avatar_url}
                              alt={`${app.job?.company.company_name}`}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-xs font-semibold">
                              {getInitials(
                                `${app.job?.company.company_name} `
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {app.job?.title || "Position"}
                </p>
                <p className="text-xs text-foreground/40">
                  {app.job?.company?.company_name || "Company"}
                </p>
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