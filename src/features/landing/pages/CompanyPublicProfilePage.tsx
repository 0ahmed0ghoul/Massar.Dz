// pages/CompanyPublicProfilePage.tsx
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Users, Globe, Calendar, CheckCircle2, Loader2, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import JobCard from '@/features/jobs/components/JobCard';
import { usePublicCompanyProfile } from '@/features/company/hooks/usePublicCompanyProfile';


export default function CompanyPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { company, jobs, loading } = usePublicCompanyProfile(id || '');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
        <h2 className="text-2xl font-bold text-foreground">Company not found</h2>
        <p className="text-muted-foreground mt-2">The company you're looking for doesn't exist.</p>
        <Button asChild className="mt-6 bg-[#639922] text-black hover:bg-[#4f7a1a]">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const companyInitials = company.company_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero section with cover (simple gradient) */}
      <div className="relative h-48 w-full bg-gradient-to-r from-[#639922]/20 to-[#2a4d0e] sm:h-64">
        <div className="absolute -bottom-12 left-6 sm:left-10">
          <Avatar className="h-24 w-24 rounded-2xl border-4 border-background sm:h-32 sm:w-32">
            <AvatarImage src={company.avatar_url || undefined} />
            <AvatarFallback className="bg-[#639922]/20 text-[#639922] text-2xl font-bold">
              {companyInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8">
        {/* Company header info */}
        <div className="flex flex-wrap justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{company.company_name}</h1>
              {company.is_verified && (
                <CheckCircle2 className="h-5 w-5 text-[#639922]" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground/60">
              {company.company_location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{company.company_location}</span>
                </div>
              )}
              {company.industry && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{company.industry}</span>
                </div>
              )}
              {company.company_size && (
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{company.company_size} employees</span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#639922] hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" /> Contact
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        {/* About section */}
        {(company.company_description || company.company_culture) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">About</h2>
            <div className="mt-3 space-y-4 text-foreground/70">
              {company.company_description && (
                <p className="whitespace-pre-wrap">{company.company_description}</p>
              )}
              {company.company_culture && (
                <div>
                  <h3 className="text-md font-medium text-foreground">Culture & Values</h3>
                  <p className="mt-1 whitespace-pre-wrap">{company.company_culture}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator className="my-8 bg-white/10" />

        {/* Jobs section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Open positions</h2>
            <Badge variant="secondary" className="bg-[#639922]/10 text-[#639922]">
              {jobs.length} jobs
            </Badge>
          </div>
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-foreground/50">
              No active job openings at the moment.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
                <JobCard key={job.id} job={{ ...job, company }} />
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-xs text-foreground/30">
          © {new Date().getFullYear()} JobHub · Company profile
        </div>
      </div>
    </div>
  );
}