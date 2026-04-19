// components/university/UniversityProfileHeader.tsx
import { Building2, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { University } from '../types/university';
import logo from '@/assets/univ-guelma.png';

interface Props {
  university: University;
}

export default function UniversityProfileHeader({ university }: Props) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {university.logo ? (
          <img src={logo} alt={university.name} className="h-16 w-16 rounded-full object-cover border border-white/20" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#639922]/20 border border-white/10">
            <Building2 className="h-8 w-8 text-[#639922]" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{university.name}</h2>
          <p className="text-sm text-white/40">Est. {university.establishedYear}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm sm:text-right">
        <div className="flex items-center gap-2 text-white/60 sm:justify-end">
          <MapPin className="h-4 w-4" />
          <span>{university.wilaya}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 sm:justify-end">
          <Mail className="h-4 w-4" />
          <span>{university.email}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 sm:justify-end">
          <Phone className="h-4 w-4" />
          <span>{university.phone}</span>
        </div>
        {university.website && (
          <div className="flex items-center gap-2 text-white/60 sm:justify-end">
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