import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";

export default function CandidateCard({ candidate, showScore = false }) {
  return (
    <Card className="bg-white/[0.03] border-white/[0.09] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-medium text-white">{candidate.firstName} {candidate.lastName}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
              <GraduationCap className="h-3 w-3 mr-1" /> {candidate.university}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
              <Briefcase className="h-3 w-3 mr-1" /> {candidate.experience}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
              <MapPin className="h-3 w-3 mr-1" /> {candidate.location}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{skill}</span>
            ))}
            {candidate.skills.length > 3 && <span className="text-xs text-white/40">+{candidate.skills.length - 3}</span>}
          </div>
        </div>
        {showScore && candidate.aiScore && (
          <div className="text-right">
            <span className="text-2xl font-bold text-[#639922]">{candidate.aiScore}%</span>
            <p className="text-xs text-white/40">AI Match</p>
          </div>
        )}
      </div>
    </Card>
  );
}