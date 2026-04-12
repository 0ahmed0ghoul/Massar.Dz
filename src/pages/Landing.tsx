import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  GraduationCap,
  Building2,
  School,
  Search,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";

const stats = [
  { label: "Active Jobs", value: "2,400+", icon: Briefcase },
  { label: "Companies", value: "850+", icon: Building2 },
  { label: "Students", value: "45,000+", icon: GraduationCap },
  { label: "Universities", value: "120+", icon: School },
];

const features = [
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Build your profile, discover opportunities, and track your applications — all in one place.",
    benefits: ["Smart job matching", "Application tracker", "Profile completeness guide"],
    cta: "Create Profile",
    href: "/register/student",
  },
  {
    icon: Building2,
    title: "For Employers",
    description: "Post jobs, search candidates, and manage applications with a powerful Kanban pipeline.",
    benefits: ["Candidate search & filters", "Application Kanban board", "Analytics dashboard"],
    cta: "Start Hiring",
    href: "/register/company",
  },
  {
    icon: School,
    title: "For Universities",
    description: "Import students, track employment outcomes, and boost your program's ranking score.",
    benefits: ["CSV student import", "Outcomes tracking", "Ranking analytics"],
    cta: "Get Started",
    href: "/register/university",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container flex flex-col items-center py-24 text-center lg:py-32">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-primary" />
            The smarter way to recruit
          </Badge>
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-12">
          <img src="src/assets/Logo.png" alt="" className="h-42 w-42"/>
          <div className="container flex flex-col items-center py-24 text-center lg:py-32">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Where <span className="text-gradient">talent meets opportunity</span> — powered by data
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Massar connects students, employers, and universities on a single platform.
            Smarter matching, transparent outcomes, and better career decisions.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link to="/register/student">
                Find Your Next Role <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <s.icon className="mb-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">One platform, three perspectives</h2>
          <p className="mt-3 text-muted-foreground">Built for every stakeholder in the hiring process.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {f.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6" variant="outline" asChild>
                  <Link to={f.href}>
                    {f.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-3 text-muted-foreground">Get started in minutes, not hours.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: Users, title: "Create your account", desc: "Choose your role — student, employer, or university — and set up your profile." },
              { step: "02", icon: Search, title: "Discover & connect", desc: "Browse jobs, search candidates, or import students. Our matching algorithm does the heavy lifting." },
              { step: "03", icon: TrendingUp, title: "Track outcomes", desc: "Monitor applications, hiring pipelines, and employment outcomes with real-time analytics." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary font-bold text-lg text-primary">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-2xl gradient-primary p-10 text-center text-primary-foreground md:p-16">
          <Shield className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="text-3xl font-bold">Ready to transform your recruitment?</h2>
          <p className="mx-auto mt-4 max-w-lg opacity-90">
            Join thousands of students, companies, and universities already using Massar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register/student">I'm a Student</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register/company">I'm an Employer</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register/university">I'm a University</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
