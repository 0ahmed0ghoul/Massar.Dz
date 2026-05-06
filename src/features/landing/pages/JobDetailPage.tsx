// pages/JobDetailPage.tsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useApplyToJob } from "@/features/jobs/hooks/useApplyToJob";
import { ApplyModal } from "@/features/jobs/components/ApplyModal";
import { useAuth } from "@/features/auth/contexts/AuthContext";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { jobs, loading } = useJobs();
  const { apply, loading: applying, getCV } = useApplyToJob();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const isStudent = profile?.role === 'student';

  const job = jobs.find((j) => j.id === id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
        <h2 className="text-2xl font-bold text-foreground">Job not found</h2>
        <p className="text-muted-foreground mt-2">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-6 bg-[#639922] text-black hover:bg-[#4f7a1a]">
          <Link to="/jobs">Browse all jobs</Link>
        </Button>
      </div>
    );
  }

  const company = job.company;
  const companyId = company?.id || job.company_id;
  const companyName = company?.company_name || "Company";
  const companyInitials = companyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const jobType = job.job_type || "full-time";
  const wilaya = company?.wilaya || job.location || "Remote";
  const salaryMin = job.salary_min || 0;
  const salaryMax = job.salary_max || 0;

  const handleApply = () => {
    setApplyModalOpen(true);
  };

  const companyProfileLink = `/companies/${companyId}`;

  return (
    <div className="relative min-h-screen bg-background transition-colors">
      {/* Grid pattern and glow (same as before) */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none fixed -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container py-12 lg:py-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mx-auto max-w-4xl rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to={companyProfileLink}>
                <Avatar className="h-12 w-12 rounded-xl border border-white/10 transition-transform hover:scale-105">
                  <AvatarImage src={company?.avatar_url} />
                  <AvatarFallback className="bg-[#639922]/10 text-[#639922] text-sm font-semibold">
                    {companyInitials}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-foreground/60">
                  <Link
                    to={companyProfileLink}
                    className="hover:text-[#639922] transition-colors"
                  >
                    {companyName}
                  </Link>
                </div>
              </div>
            </div>
            <div className="rounded-full bg-[#639922]/15 px-3 py-1 text-sm font-semibold text-[#639922]">
              {jobType.charAt(0).toUpperCase() + jobType.slice(1)}
            </div>
          </div>

          {/* Quick info row */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-white/[0.08] pt-6 text-sm">
            <div className="flex items-center gap-2 text-foreground/60">
              <MapPin className="h-4 w-4" />
              <span>{wilaya}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60">
              <DollarSign className="h-4 w-4" />
              <span>
                {salaryMin.toLocaleString()} – {salaryMax.toLocaleString()} DZD
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60">
              <Calendar className="h-4 w-4" />
              <span>
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description, Requirements, Skills, Experience (unchanged) */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">Description</h2>
            <p className="mt-2 text-foreground/70 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Requirements</h2>
              <div className="mt-2 prose prose-sm prose-invert max-w-none">
                <p className="text-foreground/70 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Required Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-sm text-foreground/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.experience_level && (
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground/60">
              <Briefcase className="h-4 w-4" />
              <span>Experience: <span className="capitalize">{job.experience_level}</span></span>
            </div>
          )}

          {/* Apply button – only for students */}
          <div className="mt-8 flex justify-end">
            {isStudent ? (
              <Button
                onClick={handleApply}
                size="lg"
                className="gap-2 bg-[#639922] text-black hover:bg-[#4f7a1a]"
              >
                Apply now <Star className="h-4 w-4" />
              </Button>
            ) : (
              <div className="text-sm text-foreground/60">
                Only students can apply for this position.
              </div>
            )}
          </div>
        </div>

        {/* Floating decorative card (premium locked) – unchanged */}
        <div className="pointer-events-none fixed bottom-8 right-8 hidden lg:block">
          <div
            className="relative w-52 rounded-2xl border border-primary/20 bg-white/5 
                  backdrop-blur-xl p-4 shadow-xl shadow-primary/20 animate-float overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  🔒
                </div>
                <p className="text-[11px] text-white/70">Premium only</p>
              </div>
            </div>
            <div className="opacity-40">
              <p className="text-xs font-semibold text-primary">🎯 Match score</p>
              <p className="text-xl font-bold text-white">--%</p>
              <p className="text-xs text-muted-foreground">Based on your profile</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Application Modal */}
      <ApplyModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        jobTitle={job.title}
        companyName={companyName}
        onSubmit={(coverLetter, cvFile) => apply(job.id, coverLetter, cvFile)}
        loading={applying}
      />
    </div>
  );
};

export default JobDetailPage;