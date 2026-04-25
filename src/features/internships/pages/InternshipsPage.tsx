// pages/InternshipsPage.tsx
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
import { useInternships } from "@/features/internships/hooks/useInternships";
import InternshipCard from "../components/InternshipCard";

const InternshipsPage = () => {
  const { internships, loading } = useInternships();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const locations = ["all", ...new Set(internships.map(i => i.location).filter(Boolean))];
  const types = ["all", ...new Set(internships.map(i => i.internship_type).filter(Boolean))];

  const filtered = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter === "all" || internship.location === locationFilter;
    const matchesType = typeFilter === "all" || internship.internship_type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

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

      {/* Glow */}
      <div className="pointer-events-none fixed -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />

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
            Kickstart your career with an <span className="text-primary">internship</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Gain real-world experience at top companies across Algeria. Filter by location, type, or skills.
          </p>
        </div>

        {/* Search & filters */}
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
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[160px] bg-card/60 border-border">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc === "all" ? "All locations" : loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-card/60 border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(t => (
                  <SelectItem key={t} value={t}>{t === "all" ? "All types" : t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {internships.length} internships
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No internships found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(internship => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}

        {/* Floating decorative card */}
        <div className="pointer-events-none fixed bottom-8 right-8 hidden lg:block">
          <div className="w-48 rounded-2xl border border-primary/20 bg-card/60 p-3 backdrop-blur-md shadow-lg shadow-primary/20 animate-float">
            <p className="text-xs font-semibold text-primary">🎓 Student favourite</p>
            <p className="text-sm font-medium">Paid internships ↑56%</p>
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

export default InternshipsPage;