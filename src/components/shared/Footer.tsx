import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-muted/30">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="gradient-primary rounded-lg p-1.5">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            Massar
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Connecting students, universities, and employers on one platform.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-sm">For Students</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link>
            <Link to="/register/student" className="hover:text-foreground transition-colors">Create Profile</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-sm">For Employers</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/register/company" className="hover:text-foreground transition-colors">Post a Job</Link>
            <Link to="/register/company" className="hover:text-foreground transition-colors">Find Candidates</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-sm">For Universities</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/register/university" className="hover:text-foreground transition-colors">Track Outcomes</Link>
            <Link to="/register/university" className="hover:text-foreground transition-colors">Improve Rankings</Link>
          </nav>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Massar. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
