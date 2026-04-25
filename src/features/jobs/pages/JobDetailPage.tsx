// pages/JobDetailPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Briefcase, Calendar, Building, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/features/jobs/hooks/useJobs";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, loading, getJobById } = useJobs();
  const job = id ? getJobById(id) : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <h2 className="text-2xl font-bold text-foreground">Job not found</h2>
        <p className="text-muted-foreground">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/jobs">Browse all jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background transition-colors">
      {/* Grid pattern */}
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
      <div className="pointer-events-none fixed -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />

      <div className="relative z-10 container py-12 lg:py-20">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Main card */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">{job.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </div>
            <div className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
              {job.job_type}
            </div>
          </div>

          {/* Quick info row */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.wilaya}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()} DA</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(job.created_at || "").toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">Description</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Required Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply button */}
          <div className="mt-8 flex justify-end">
            <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Apply now <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating decorative card */}
        <div className="pointer-events-none fixed bottom-8 right-8 hidden lg:block">
          <div className="w-48 rounded-2xl border border-primary/20 bg-card/60 p-3 backdrop-blur-md shadow-lg shadow-primary/20 animate-float">
            <p className="text-xs font-semibold text-primary">🎯 Match score</p>
            <p className="text-lg font-bold">94%</p>
            <p className="text-xs text-muted-foreground">based on your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;