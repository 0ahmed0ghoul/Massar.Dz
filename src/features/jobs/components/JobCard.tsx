import { Link } from "react-router-dom";
import { MapPin, DollarSign, Briefcase, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns"; // Optional: for "2 days ago" labels

interface JobCardProps {
  job: Job & { company?: { company_name: string; avatar_url: string; wilaya: string } };
}

const JobCard = ({ job }: JobCardProps) => {
  const company = job.company;
  const companyInitials = company?.company_name
    ? company.company_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "CO";

  return (
    <Link to={`/experience/${job.id}`} className="block group h-full">
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#639922]/40 hover:shadow-[0_8px_30px_rgb(99,153,34,0.12)]">
        
        {/* Animated Hover Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#639922]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Company Avatar with Glow */}
              <div className="relative">
                <Avatar className="h-12 w-12 rounded-xl border border-white/10 ring-2 ring-transparent group-hover:ring-[#639922]/20 transition-all">
                  <AvatarImage src={company?.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-[#639922]/20 to-[#639922]/5 text-[#639922] font-bold">
                    {companyInitials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white group-hover:text-[#639922] transition-colors line-clamp-1 leading-tight">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-foreground/50 mt-1">
                  {company?.company_name || "Confidential Company"}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-[#639922]/10 border border-[#639922]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#639922]">
              {job.job_type?.replace('-', ' ')}
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/70 line-clamp-2 min-h-[2.5rem]">
            {job.description}
          </p>

          {/* Skills chips */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill: string) => (
                <span key={skill} className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-medium text-foreground/60 border border-white/5">
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="text-[11px] text-[#639922] font-semibold self-center ml-1">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Spacer to push details to bottom */}
        <div className="flex-1" />

        <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[12px]">
            {company?.wilaya && (
              <div className="flex items-center gap-2 text-foreground/50">
                <MapPin className="h-3.5 w-3.5 text-[#639922]/70" />
                <span className="truncate">{company.wilaya}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-foreground/50">
              <Briefcase className="h-3.5 w-3.5 text-[#639922]/70" />
              <span>{job.experience_level || 'Entry Level'}</span>
            </div>

            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-2 text-foreground/80 font-medium col-span-2">
                <DollarSign className="h-3.5 w-3.5 text-[#639922]" />
                <span>
                  {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()} <span className="text-[10px] opacity-60">{job.salary_currency}</span>
                </span>
              </div>
            )}
          </div>

          <Button 
            className="mt-5 w-full bg-white/5 hover:bg-[#639922] hover:text-white border-white/10 transition-all duration-300 group/btn" 
            variant="outline" 
            size="sm"
          >
            <span className="mr-2">View Details</span>
            <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;