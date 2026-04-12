import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0c0e]/80 backdrop-blur-md">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative z-10 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white transition-all hover:opacity-80">
            <img src="src/assets/Logo-icon.jpg" alt="Massar Logo" className="h-5 w-5" />
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Massar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            to="/jobs" 
            className="group relative text-sm font-medium text-white/60 transition-all hover:text-white"
          >
            Browse Jobs
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-white to-green-700 transition-all group-hover:w-full" />
          </Link>
          <Link 
            to="/register/company" 
            className="group relative text-sm font-medium text-white/60 transition-all hover:text-white"
          >
            For Employers
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-white to-green-700 transition-all group-hover:w-full" />
          </Link>
          <Link 
            to="/register/university" 
            className="group relative text-sm font-medium text-white/60 transition-all hover:text-white"
          >
            For Universities
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-white to-green-700 transition-all group-hover:w-full" />
          </Link>
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button 
            variant="ghost" 
            asChild 
            className="text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <Link to="/login">Sign In</Link>
          </Button>
          <Button 
            asChild 
            className="relative overflow-hidden text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <Link to="/register/student">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white/60 hover:bg-white/10 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="relative border-t border-white/10 bg-[#0b0c0e] p-4 backdrop-blur-md md:hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <nav className="relative z-10 flex flex-col gap-4">
            <Link 
              to="/jobs" 
              className="text-sm font-medium text-white/60 transition-all hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link 
              to="/register/company" 
              className="text-sm font-medium text-white/60 transition-all hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              For Employers
            </Link>
            <Link 
              to="/register/university" 
              className="text-sm font-medium text-white/60 transition-all hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              For Universities
            </Link>
            <hr className="border-white/10" />
            <Button 
              variant="ghost" 
              asChild 
              className="justify-start text-white/60 hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              <Link to="/register/student">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;