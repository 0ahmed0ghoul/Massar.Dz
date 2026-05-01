// components/jobs/JobCard.tsx
import { Link } from "react-router-dom";
import { MapPin, DollarSign, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database";

type Job = Tables<"jobs"> & { skills?: string[][] };

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Link to={`/jobs/${job.id}`} className="block group">
      <div className="relative rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/10">
        {/* Decorative top line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <div className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {job.job_type}
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        {/* Skills chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Details row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{job.wilaya}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()} DA</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            <span>{job.job_type}</span>
          </div>
        </div>

        <Button className="mt-4 w-full gap-1" variant="outline" size="sm" asChild>
          {/* Prevent link from interfering with button click */}
          <div onClick={(e) => e.preventDefault()}>
            View details <Star className="h-3 w-3" />
          </div>
        </Button>
      </div>
    </Link>
  );
};

export default JobCard;