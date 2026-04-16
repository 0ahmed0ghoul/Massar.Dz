import { Link } from "react-router-dom";
import { Briefcase, Twitter, Linkedin, Github, Mail, MapPin, Phone, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0b0c0e]">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle gradient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 py-12">
        {/* Main footer content */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-2 font-bold text-xl transition-all">
            <img src="src/assets/Logo-icon.jpg" alt="Massar Logo" className="h-5 w-5" />

              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Massar
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-white/40 leading-relaxed">
              Connecting students, universities, and employers on one platform. 
              Smarter matching, transparent outcomes, and better career decisions.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/40 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Students */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">For Students</h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Browse Jobs", href: "/jobs" },
                { name: "Create Profile", href: "/register/student" },
                { name: "Career Resources", href: "/resources" },
                { name: "Success Stories", href: "/stories" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-white/40 transition-all hover:text-white hover:translate-x-0.5 inline-block"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">For Employers</h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Post a Job", href: "/register" },
                { name: "Find Candidates", href: "/register" },
                { name: "Pricing", href: "/pricing" },
                { name: "Success Stories", href: "/stories" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-white/40 transition-all hover:text-white hover:translate-x-0.5 inline-block"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Universities */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">For Universities</h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Track Outcomes", href: "/register/university" },
                { name: "Improve Rankings", href: "/register/university" },
                { name: "Integration", href: "/integration" },
                { name: "Case Studies", href: "/case-studies" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-white/40 transition-all hover:text-white hover:translate-x-0.5 inline-block"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Contact info row */}
        <div className="mt-10 flex flex-wrap justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-white/40" />
            <span className="text-sm text-white/40">Algiers, Algeria</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-white/40" />
            <span className="text-sm text-white/40">+213 (0) 123 456 789</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-white/40" />
            <span className="text-sm text-white/40">contact@massar.dz</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center md:flex-row">
          <div className="text-sm text-white/30">
            © {currentYear} Massar. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/30 transition-all hover:text-white/60">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/30 transition-all hover:text-white/60">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-white/30 transition-all hover:text-white/60">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Sparkles className="h-3 w-3" />
            <span>Made with ❤️ in Algeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;