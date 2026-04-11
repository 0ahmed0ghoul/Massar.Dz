import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building2, Clock, DollarSign, ArrowLeft, ExternalLink, Briefcase } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const JobDetail = () => {
  const { id } = useParams();

  // Mock data — will be replaced with real query
  const job = {
    id,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90k–$130k",
    is_remote: true,
    posted: "2 days ago",
    description: "We're looking for a talented Frontend Developer to join our team. You'll work on building beautiful, performant web applications using React and TypeScript.",
    requirements: ["3+ years React experience", "Strong TypeScript skills", "Experience with modern CSS", "Familiarity with testing frameworks"],
    skills: ["React", "TypeScript", "TailwindCSS", "Jest"],
    experience_level: "Mid-level",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-4xl py-8">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" />Back to Jobs</Link>
          </Button>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  {job.is_remote && <Badge variant="secondary">Remote</Badge>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salary}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{job.posted}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Apply for this role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link to="/login">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Apply Now
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Sign in or create a student account to apply
                  </p>
                  <Separator />
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium">{job.experience_level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
