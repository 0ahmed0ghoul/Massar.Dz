import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogOut, Moon, Sun, Home, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { ROLES } from "@/constants/roles";
import LogoIcon from "@/assets/Logo-icon.jpg";

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme(prev => (prev === "dark" ? "light" : "dark")),
  };
}

const Navbar = () => {
  const { user, profile, role, isLoading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenMenu(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
    setMobileOpen(false);
    setOpenMenu(false);
  };

  const getDashboard = () => {
  if (profile?.status === "pending") return "/pending-approval";   
   if (!profile?.is_completed ) return "/complete-profile";

    switch (role) {
      case ROLES.STUDENT: return "/student/dashboard";
      case ROLES.COMPANY_ADMIN: return "/dashboard/company";
      case ROLES.UNIVERSITY_ADMIN: return "/university/dashboard";
      case ROLES.SUPER_ADMIN: return "/dashboard/admin";
      default: return "/";
    }
  };

  const initials = (profile?.first_name?.[0] ?? "") + (profile?.last_name?.[0] ?? "");

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        {/* Grid pattern - optional decorative element */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="container relative z-10 flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link 
            to="/" 
            className="group flex items-center gap-3 text-lg font-bold text-foreground"
            aria-label="Massar Home"
          >
            <div className="relative">
              <img 
                src={LogoIcon} 
                alt="Massar Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-md" 
              />
              <div className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 bg-primary/40" />
            </div>
            <span className="tracking-tight transition-colors duration-200 group-hover:text-primary">Massar</span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <Link
              to="/jobs"
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground group"
            >
              Jobs
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              to="/internships"
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground group"
            >
              Internships
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
          </nav>

          {/* DESKTOP RIGHT SIDE */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  className="relative overflow-hidden bg-primary text-primary-foreground group"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Get Started</span>
                    <span className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-white ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  aria-label="User menu"
                  aria-expanded={openMenu}
                  aria-haspopup="true"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    initials || "U"
                  )}
                </button>

                {openMenu && (
                  <div 
                    className="absolute right-0 mt-3 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right"
                    style={{
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(getDashboard());
                        setOpenMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                      role="menuitem"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          style={{ top: '64px' }}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div 
            ref={mobileMenuRef}
            className="flex flex-col h-full animate-in slide-in-from-right duration-300"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Theme toggle in mobile */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition-colors"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4" aria-label="Mobile navigation">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  to="/jobs"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  Jobs
                </Link>
                <Link
                  to="/internships"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  <GraduationCap className="h-5 w-5" />
                  Internships
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="border-t border-border pt-6 space-y-4">
                {!user ? (
                  <>
                    <Button variant="outline" asChild className="w-full justify-start gap-3">
                      <Link to="/login" onClick={closeMobileMenu}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start gap-3 bg-primary text-primary-foreground">
                      <Link to="/register" onClick={closeMobileMenu}>
                        <Sparkles className="h-4 w-4" />
                        Get Started
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={`${profile.first_name} ${profile.last_name}`}
                            className="h-full w-full object-cover rounded-full" 
                          />
                        ) : (
                          initials || "U"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" asChild className="w-full justify-start gap-3">
                      <Link to={getDashboard()} onClick={closeMobileMenu}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;