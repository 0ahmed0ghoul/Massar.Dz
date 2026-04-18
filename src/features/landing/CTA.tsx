import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, GraduationCap, Building2, School, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b0c0e] py-24">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-6">
            <Sparkles className="h-3 w-3 text-white/60" />
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
              Join the future of recruitment
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Ready to transform
            <br />
            <span className="text-[#639922]">
              your recruitment?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-md text-white/40">
            Join thousands of students, companies, and universities already using Massar.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="group bg-white text-black hover:bg-white/90 transition-all duration-300"
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
              className="group border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
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
              className="group border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
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
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b0c0e] px-4 text-xs text-white/30">or</span>
            </div>
          </div>

          {/* Alternative CTA */}
          <div>
            <Button
              asChild
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Link to="/jobs">
                Browse jobs as guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-white/30">
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