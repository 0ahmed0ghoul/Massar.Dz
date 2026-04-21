import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogOut, Moon, Sun } from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getDashboard = () => {
    if (profile?.status === "pending") return "/pending-approval";
    switch (role) {
      case ROLES.STUDENT: return "/student/dashboard";
      case ROLES.COMPANY_ADMIN: return "/dashboard/company";
      case ROLES.UNIVERSITY_ADMIN: return "/university/dashboard";
      case ROLES.SUPER_ADMIN: return "/dashboard/admin";
      default: return "/";
    }
  };

  const initials = (profile?.first_name?.[0] ?? "") + (profile?.last_name?.[0] ?? "");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container relative z-10 flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-3 text-lg font-bold text-foreground">
          <div className="relative">
            <img src={LogoIcon} className="h-10 w-10 rounded-xl object-cover shadow-md" />
            <div className="absolute inset-0 rounded-xl opacity-0 blur-md transition group-hover:opacity-100 bg-primary/40" />
          </div>
          <span className="tracking-tight transition group-hover:text-primary">Massar</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Jobs", "Internships"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative text-sm text-muted-foreground transition hover:text-foreground group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>

              {/* ✅ FIXED: asChild now has a single child <Link> with everything inside */}
              <Button asChild className="relative overflow-hidden bg-primary text-primary-foreground">
                <Link to="/register" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started</span>
                  {/* Shine effect moved inside the Link */}
                  <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-white ring-2 ring-primary/20 hover:ring-primary/40 transition"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="h-full w-full object-cover" />
                ) : (
                  initials || "U"
                )}
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate(getDashboard())}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate(getDashboard() + "/profile")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <Button variant="ghost" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block hover:text-foreground">
            Jobs
          </Link>
          {user && (
            <Link to={getDashboard()} onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          )}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Get Started</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;