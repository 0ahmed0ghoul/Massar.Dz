// RecommendedJobs.tsx
import { Sparkles } from "lucide-react";

const RecommendedJobs = ({ jobs = [] }) => {
  // Mock data (will be used if jobs prop is empty)
  const mockJobs = [
    { id: 1, title: "Frontend Developer", company: "Google", location: "Mountain View, CA", match: 98 },
    { id: 2, title: "Software Engineer", company: "Microsoft", location: "Redmond, WA", match: 95 },
    { id: 3, title: "Product Manager", company: "Meta", location: "Menlo Park, CA", match: 92 },
    { id: 4, title: "Data Scientist", company: "Amazon", location: "Seattle, WA", match: 89 },
  ];

  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#639922]" />
        <h2 className="text-lg font-bold text-foreground">Recommended for You</h2>
      </div>

      <div className="space-y-4">
        {displayJobs.map((job) => (
          <div key={job.id} className="group relative rounded-xl border border-white/[0.05] bg-gradient-to-r from-white/[0.04] to-transparent p-4 transition-all hover:border-[#639922]/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-bold text-foreground transition-colors group-hover:text-[#639922]">{job.title}</p>
                <p className="text-xs text-foreground/50">{job.company} • {job.location || "Remote"}</p>
              </div>
              <div className="rounded bg-[#639922]/10 px-2 py-0.5 text-[11px] font-bold text-[#639922]">
                {job.match || Math.floor(Math.random() * 20 + 80)}% Match
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-[#639922] py-2 text-xs font-bold text-foreground transition hover:bg-[#4f7a1a]">
                Quick Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;