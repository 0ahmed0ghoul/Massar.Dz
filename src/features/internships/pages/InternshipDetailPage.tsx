// pages/InternshipDetailPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Building, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInternships } from "@/features/internships/hooks/useInternships";

const InternshipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { internships, loading, getInternshipById } = useInternships();
  const internship = id ? getInternshipById(id) : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <h2 className="text-2xl font-bold text-foreground">Internship not found</h2>
        <p className="text-muted-foreground">The internship you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/internships">Browse all internships</Link>
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
              <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">{internship.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{internship.company}</span>
              </div>
            </div>
            <div className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
              {internship.internship_type}
            </div>
          </div>

          {/* Quick info row */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{internship.stipend_min?.toLocaleString()} – {internship.stipend_max?.toLocaleString()} DA</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(internship.created_at || "").toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">Description</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{internship.description}</p>
          </div>

          {/* Requirements */}
          {internship.requirements && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Requirements</h2>
              <p className="mt-2 text-muted-foreground">{internship.requirements}</p>
            </div>
          )}

          {/* Skills */}
          {internship.skills && internship.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Preferred Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {internship.skills.map(skill => (
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
              Apply now <GraduationCap className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating decorative card */}
        <div className="pointer-events-none fixed bottom-8 right-8 hidden lg:block">
          <div className="w-48 rounded-2xl border border-primary/20 bg-card/60 p-3 backdrop-blur-md shadow-lg shadow-primary/20 animate-float">
            <p className="text-xs font-semibold text-primary">📈 Career boost</p>
            <p className="text-sm font-medium">65% get hired after</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;