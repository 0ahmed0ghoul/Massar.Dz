import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Star,
  Loader2,
  Share2,
  CheckCircle2,
  Trophy,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useApplyToJob } from "@/features/jobs/hooks/useApplyToJob";
import { ApplyModal } from "@/features/jobs/components/ApplyModal";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner"; // Assuming you use sonner for toasts

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { jobs, loading } = useJobs();
  const { apply, loading: applying } = useApplyToJob();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  
  // Logic placeholders
  const isStudent = profile?.role === 'student';
  const isPremium = false; // Toggle this to test the blur effect
  
  const job = jobs.find((j) => j.id === id);

  // ── Share Feature Implementation ──
  const handleShare = async () => {
    const shareData = {
      title: job?.title,
      text: `Check out this job opening at ${job?.company?.company_name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return null;

  const company = job.company;
  const companyName = company?.company_name || "Company";
  const matchScore = 94; 

  return (
    <div className="relative min-h-screen bg-background transition-colors overflow-hidden">
      {/* Background Patterns */}
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
      <div className="pointer-events-none fixed -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl opacity-50" />

      <div className="container relative z-10 py-12 lg:py-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to opportunities
        </Button>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: Content */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md md:p-10 shadow-xl shadow-primary/5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <Avatar className="h-16 w-16 rounded-2xl border border-primary/20 shadow-lg">
                    <AvatarImage src={company?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                      {companyName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        {job.job_type}
                      </Badge>
                      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
                      {job.title}
                    </h1>
                    <Link to={`/companies/${company?.id}`} className="flex items-center gap-1.5 text-lg font-medium text-muted-foreground hover:text-primary transition-colors">
                      {companyName} <CheckCircle2 className="h-4 w-4 text-primary" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-border/50">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="flex items-center gap-2 font-semibold text-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {job.location || "Remote"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Salary</p>
                  <p className="flex items-center gap-2 font-semibold text-foreground">
                    <DollarSign className="h-4 w-4 text-primary" /> 
                    {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()} <span className="text-[10px] text-muted-foreground">DZD</span>
                  </p>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Experience</p>
                  <p className="flex items-center gap-2 font-semibold text-foreground capitalize">
                    <Briefcase className="h-4 w-4 text-primary" /> {job.experience_level}
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Description</h3>
                  <p className="text-[16px] leading-relaxed text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </section>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ── Match Score Card with Premium Blur ── */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md shadow-lg shadow-primary/10 animate-float">
              {!isPremium && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md transition-all">
                  <Lock className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-sm font-bold text-foreground">Premium Feature</p>
                  <Link to="/pricing" className="h-auto p-0 text-xs text-primary">Upgrade to see match</Link>
                </div>
              )}
              
              <div className={!isPremium ? "blur-sm select-none" : ""}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Match Rate</p>
                    <p className="text-2xl font-black text-primary">{matchScore}%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${matchScore}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-snug">
                  Your profile matches <span className="font-bold text-foreground">{matchScore}%</span> of the requirements.
                </p>
              </div>
            </div>

            {/* Application Card */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md">
              <h4 className="font-bold text-foreground mb-4">Ready to apply?</h4>
              {isStudent ? (
                <Button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full bg-primary py-6 text-lg font-bold text-primary-foreground hover:bg-primary/90 rounded-xl transition-all hover:scale-[1.02]"
                >
                  Apply Now <Star className="ml-2 h-5 w-5 fill-current" />
                </Button>
              ) : (
                <div className="rounded-lg bg-muted p-4 text-center text-xs text-muted-foreground italic">
                  Applications are currently open for students only.
                </div>
              )}
              
              <div className="mt-6 flex flex-col gap-3">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="w-full justify-start gap-2 border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <Share2 className="h-4 w-4" /> Share with friends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

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