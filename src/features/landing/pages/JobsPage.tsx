// pages/JobsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Briefcase, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import JobCard from "../../jobs/components/JobCard";

const JobsPage = () => {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Extract unique wilayas and job types from jobs
  const wilayas = ["all", ...new Set(jobs.map(j => j.company?.wilaya).filter(Boolean))];
  const jobTypes = ["all", ...new Set(jobs.map(j => j.job_type).filter(Boolean))];

  const filteredJobs = jobs.filter(job => {
    // Search term: job title, company name, or skills
    const matchesSearch = searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.company_name && job.company.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(job.skills) && job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesWilaya = wilayaFilter === "all" || job.company?.wilaya === wilayaFilter;
    const matchesType = typeFilter === "all" || job.job_type === typeFilter;
    return matchesSearch && matchesWilaya && matchesType;
  });

  return (
    <div className="relative min-h-screen bg-background transition-colors">
      {/* Grid Pattern */}
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

      {/* Glow effect */}
      <div className="pointer-events-none fixed -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 container py-12 lg:py-20">
        {/* Back to Home button */}
        <div className="mb-6 flex justify-start">
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Discover your <span className="text-[#639922]">next opportunity</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse hundreds of jobs from top companies across Algeria. Filter by location, type, and skills.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card/60 border-border"
            />
          </div>
          <div className="flex gap-3">
            <Select value={wilayaFilter} onValueChange={setWilayaFilter}>
              <SelectTrigger className="w-[160px] bg-card/60 border-border">
                <SelectValue placeholder="Wilaya" />
              </SelectTrigger>
              <SelectContent>
                {wilayas.map(w => (
                  <SelectItem key={w} value={w}>{w === "all" ? "All wilayas" : w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-card/60 border-border">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map(t => (
                  <SelectItem key={t} value={t}>{t === "all" ? "All types" : t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> of {jobs.length} jobs
          </p>
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#639922] border-t-transparent" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Floating decorative card */}
        <div className="pointer-events-none fixed bottom-8 right-8 hidden lg:block">
          <div className="w-48 rounded-2xl border border-primary/20 bg-card/60 p-3 backdrop-blur-md shadow-lg shadow-primary/20 animate-float">
            <p className="text-xs font-semibold text-[#639922]">🔥 Trending</p>
            <p className="text-sm font-medium">Full‑stack dev roles ↑42%</p>
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
    </div>
  );
};

export default JobsPage;