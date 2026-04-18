import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Building2, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_JOBS = [
  { id: "1", title: "Frontend Developer", company: "TechCorp", location: "San Francisco, CA", type: "full_time", salary: "$90k–$130k", skills: ["React", "TypeScript"], is_remote: true, posted: "2 days ago" },
  { id: "2", title: "Data Analyst Intern", company: "DataViz Inc", location: "New York, NY", type: "internship", salary: "$25/hr", skills: ["Python", "SQL"], is_remote: false, posted: "5 days ago" },
  { id: "3", title: "UX Designer", company: "DesignStudio", location: "London, UK", type: "full_time", salary: "£55k–£75k", skills: ["Figma", "User Research"], is_remote: true, posted: "1 day ago" },
  { id: "4", title: "Backend Engineer", company: "CloudScale", location: "Berlin, DE", type: "contract", salary: "€80k–€100k", skills: ["Node.js", "PostgreSQL"], is_remote: true, posted: "3 days ago" },
  { id: "5", title: "Marketing Coordinator", company: "GrowthCo", location: "Toronto, CA", type: "part_time", salary: "$30/hr", skills: ["SEO", "Content"], is_remote: false, posted: "1 week ago" },
  { id: "6", title: "ML Engineer", company: "AI Labs", location: "Remote", type: "full_time", salary: "$140k–$180k", skills: ["Python", "TensorFlow"], is_remote: true, posted: "4 days ago" },
];

const typeLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  contract: "Contract",
  remote: "Remote",
};

const JobBoard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || j.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="gradient-hero border-b">
          <div className="container py-12">
            <h1 className="text-3xl font-bold">Find your next opportunity</h1>
            <p className="mt-2 text-muted-foreground">Browse open positions from top employers</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="container py-8">
          <p className="mb-4 text-sm text-muted-foreground">{filtered.length} jobs found</p>
          <div className="flex flex-col gap-4">
            {filtered.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {job.is_remote && <Badge variant="secondary">Remote</Badge>}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.posted}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className="self-start sm:self-center">{typeLabels[job.type]}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center">
                <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="font-semibold">No jobs found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobBoard;
