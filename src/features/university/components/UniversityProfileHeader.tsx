// components/university/UniversityProfileHeader.tsx
import { Building2, MapPin, Mail, Globe } from 'lucide-react';
import { UniversityProfile } from '../services/universityProfile.service';

interface Props {
  university: UniversityProfile;
}

export default function UniversityProfileHeader({ university }: Props) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {university.avatar_url ? (
          <img src={university.avatar_url} alt={university.university_name || 'University'} className="h-16 w-16 rounded-full object-cover border border-white/20" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#639922]/20 border border-white/10">
            <Building2 className="h-8 w-8 text-[#639922]" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-foreground">{university.university_name || 'University'}</h2>
          <p className="text-sm text-foreground/40">{university.rector_name ? `Rector: ${university.rector_name}` : 'University'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm sm:text-right">
        <div className="flex items-center gap-2 text-foreground/60 sm:justify-end">
          <MapPin className="h-4 w-4" />
          <span>{university.wilaya || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/60 sm:justify-end">
          <Mail className="h-4 w-4" />
          <span>{university.email || '—'}</span>
        </div>
        {university.website && (
          <div className="flex items-center gap-2 text-foreground/60 sm:justify-end">
            <Globe className="h-4 w-4" />
            <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#639922] transition">
              {university.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}