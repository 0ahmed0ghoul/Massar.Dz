// components/internships/InternshipCard.tsx
import { Link } from "react-router-dom";
import { MapPin, Clock, DollarSign, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database";

type Internship = Tables<"internships"> & { skills?: string[] };

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard = ({ internship }: InternshipCardProps) => {
  return (
    <Link to={`/internships/${internship.id}`} className="block group">
      <div className="relative rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/10">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{internship.title}</h3>
            <p className="text-sm text-muted-foreground">{internship.company}</p>
          </div>
          <div className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {internship.internship_type}
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{internship.description}</p>

        {/* Skills chips */}
        {internship.skills && internship.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {internship.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
            {internship.skills.length > 3 && (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{internship.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Details row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{internship.stipend_min?.toLocaleString()} – {internship.stipend_max?.toLocaleString()} DA</span>
          </div>
        </div>

        <Button className="mt-4 w-full gap-1" variant="outline" size="sm" asChild>
          <div onClick={(e) => e.preventDefault()}>
            View details <Star className="h-3 w-3" />
          </div>
        </Button>
      </div>
    </Link>
  );
};

export default InternshipCard;