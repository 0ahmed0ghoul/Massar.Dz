// pages/company/TalentPage.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Brain, Zap, Sparkles, Building2 } from "lucide-react";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import CandidateCard from "../components/CandidateCard";

export default function TalentPage() {
  const { jobs, loading: jobsLoading } = useCompanyJobs();
  const [filters, setFilters] = useState({ skills: "", university: "", experience: "", location: "" });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiJobId, setAiJobId] = useState("");
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [matching, setMatching] = useState(false);

  const activeJobs = jobs.filter(j => j.status === "active");

  const handleSearch = async () => {
    setSearching(true);
    setTimeout(() => {
      setSearchResults([]);
      setSearching(false);
    }, 500);
  };

  const handleAIMatch = async () => {
    if (!aiJobId) return;
    setMatching(true);
    setTimeout(() => {
      setAiResults([]);
      setMatching(false);
    }, 800);
  };

  const handleAutoScreen = async () => {
    if (!aiJobId) return;
    setMatching(true);
    setTimeout(() => {
      setAiResults([]);
      setMatching(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Talent Database</h1>
          <p className="mt-1 text-sm text-foreground/40">Search, filter, and match candidates with AI.</p>
        </div>

        {/* Filter Section */}
        <div className="group mb-6 rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-foreground">Filter Candidates</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                placeholder="Skills (comma separated)"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/30"
              />
              <Input
                placeholder="University"
                value={filters.university}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/30"
              />
              <Input
                placeholder="Experience (e.g., 2+ years)"
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/30"
              />
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/30"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching} className="mt-5 bg-[#639922] text-foreground hover:bg-[#4f7a1a]">
              <Search className="mr-2 h-4 w-4" />
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* AI Matching Section */}
        <div className="group mb-6 rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#639922]" />
              <h2 className="text-lg font-semibold text-foreground">AI Candidate Matching</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={aiJobId}
                  onChange={(e) => setAiJobId(e.target.value)}
                  className="flex-1 rounded-md border border-white/20 bg-white/10 p-2 text-foreground"
                  disabled={jobsLoading}
                >
                  <option value="">Select a job to match candidates</option>
                  {activeJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleAIMatch}
                  disabled={!aiJobId || matching}
                  variant="outline"
                  className="border-white/20 text-foreground hover:bg-white/10"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Find Top 10 Matches
                </Button>
                <Button
                  onClick={handleAutoScreen}
                  disabled={!aiJobId || matching}
                  variant="outline"
                  className="border-white/20 text-foreground hover:bg-white/10"
                >
                  <Zap className="mr-2 h-4 w-4" /> Auto‑Screen by Experience
                </Button>
              </div>
              {matching && (
                <div className="mt-4 text-center text-sm text-foreground/40">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#639922] border-t-transparent" />
                    Processing...
                  </div>
                </div>
              )}
              {aiResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-foreground/60">Showing {aiResults.length} candidates:</p>
                  {aiResults.map((c) => (
                    <CandidateCard key={c.id} candidate={c} showScore />
                  ))}
                </div>
              )}
              {!matching && aiResults.length === 0 && aiJobId && (
                <div className="mt-4 rounded-xl border border-[#639922]/20 bg-[#639922]/5 p-4 text-center text-sm text-foreground/50">
                  <Building2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  AI matching will be available soon. We're building a powerful candidate recommendation engine.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#639922]/30">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Search Results</h2>
              <span className="text-sm text-foreground/40">{searchResults.length} candidates</span>
            </div>
            <div className="space-y-3">
              {searchResults.map((c) => (
                <CandidateCard key={c.id} candidate={c} />
              ))}
              {!searching && searchResults.length === 0 && (
                <p className="py-6 text-center text-sm text-foreground/40">
                  No candidates match your filters. Try adjusting your search criteria.
                </p>
              )}
              {searching && (
                <div className="py-6 text-center text-sm text-foreground/40">Searching...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}