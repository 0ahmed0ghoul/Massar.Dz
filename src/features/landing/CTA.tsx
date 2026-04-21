import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, GraduationCap, Building2, School, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Grid pattern - guaranteed visible in both themes */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient background glow - using theme primary color */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-3 py-1">
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Join the future of recruitment
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Ready to transform
            <br />
            <span className="text-primary">
              your recruitment?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join thousands of students, companies, and universities already using Massar.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              <Link to="/register">
                <GraduationCap className="mr-2 h-4 w-4" />
                I'm a Student
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-border bg-card/30 text-foreground hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
            >
              <Link to="/register">
                <Building2 className="mr-2 h-4 w-4" />
                I'm an Employer
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-border bg-card/30 text-foreground hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
            >
              <Link to="/register">
                <School className="mr-2 h-4 w-4" />
                I'm a University
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground/60">or</span>
            </div>
          </div>

          {/* Alternative CTA */}
          <div>
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-card/30"
            >
              <Link to="/jobs">
                Browse jobs as guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <Shield className="h-3 w-3" />
            <span>Free forever</span>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;