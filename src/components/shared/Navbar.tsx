import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="gradient-primary rounded-lg p-1.5">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>RecruitHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Jobs
          </Link>
          <Link to="/register/company" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For Employers
          </Link>
          <Link to="/register/university" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For Universities
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/register/student">Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/jobs" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
            <Link to="/register/company" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>For Employers</Link>
            <Link to="/register/university" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>For Universities</Link>
            <hr className="my-2" />
            <Button variant="ghost" asChild><Link to="/login">Sign In</Link></Button>
            <Button asChild><Link to="/register/student">Get Started</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
