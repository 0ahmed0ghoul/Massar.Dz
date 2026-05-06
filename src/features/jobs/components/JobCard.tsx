// components/jobs/JobCard.tsx
import { Link } from "react-router-dom";
import { MapPin, DollarSign, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job & { company?: { company_name: string; avatar_url: string; wilaya: string } };
}

const JobCard = ({ job }: JobCardProps) => {
  const company = job.company;
  const companyInitials = company?.company_name
    ? company.company_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "CO";

  return (
    <Link to={`/jobs/${job.id}`} className="block group">
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/10 h-full flex flex-col">
        {/* Decorative top line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#639922]/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

        <div className="flex items-start gap-3">
          {/* Company Avatar */}
          <Avatar className="h-10 w-10 rounded-xl border border-white/10 shrink-0">
            <AvatarImage src={company?.avatar_url} />
            <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-xs font-semibold">
              {companyInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground line-clamp-1">{job.title}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-sm text-foreground/60 truncate">{company?.company_name || "Company"}</p>
            </div>
          </div>

          <div className="rounded-full bg-[#639922]/15 px-2.5 py-0.5 text-xs font-semibold text-[#639922] whitespace-nowrap">
            {job.job_type?.replace('-', ' ')}
          </div>
        </div>

        <p className="mt-3 text-sm text-foreground/60 line-clamp-2 flex-1">{job.description}</p>

        {/* Skills chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill: string) => (
              <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground/50">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground/50">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Details row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground/50">
          {company?.wilaya && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{company.wilaya}</span>
            </div>
          )}
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>
                {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()} {job.salary_currency}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            <span>{job.experience_level || 'Any level'}</span>
          </div>
        </div>

        <Button className="mt-4 w-full gap-1" variant="outline" size="sm">
          <Eye className="h-3 w-3" /> View details
        </Button>
      </div>
    </Link>
  );
};

export default JobCard;