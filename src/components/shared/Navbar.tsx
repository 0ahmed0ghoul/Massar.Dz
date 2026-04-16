import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { ROLES } from "@/constants/roles";
import LogoIcon from "@/assets/Logo-icon.jpg";

const Navbar = () => {
  // ✅ ALL HOOKS at the top level (before any conditional returns)
  const { user, profile, role, isLoading, signOut } = useAuth();
  const [forceShow, setForceShow] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Loading timeout fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth loading timeout - forcing navbar render");
        setForceShow(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // ✅ Logout handler
  const handleLogout = async () => {
    await signOut();
    setOpenMenu(false);
    setMobileOpen(false);
    navigate("/login");
  };

  // ✅ Conditional return after all hooks
  if (isLoading && !forceShow) {
    return (
      <header className="h-16 border-b border-white/10 bg-[#0b0c0e]/80" />
    );
  }

  // -------------------------
  // ROLE DASHBOARD ROUTING
  // -------------------------
  const getDashboard = () => {
    switch (role) {
      case ROLES.STUDENT:
        return "/dashboard/student";
      case ROLES.COMPANY_ADMIN:
        return "/dashboard/company";
      case ROLES.UNIVERSITY_ADMIN:
        return "/dashboard/university";
      case ROLES.SUPER_ADMIN:
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  // -------------------------
  // USER INITIALS (fallback)
  // -------------------------
  const initials =
    (profile?.first_name?.[0] ?? "") +
    (profile?.last_name?.[0] ?? "");

  // -------------------------
  // UI
  // -------------------------
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0c0e]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="font-bold text-white flex items-center gap-4 text-lg">
          <img src={LogoIcon} className="h-10 w-10 rounded-full" />
          Massar
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-white/70">
          <Link to="/jobs">Jobs</Link>
          <Link to="/internships">Internships</Link>
        </nav>

        {/* AUTH AREA */}
        <div className="hidden md:flex items-center gap-3">

          {!user ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild className="bg-[#639922]">
                <Link to="/register">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </>
          ) : (
            <div className="relative" ref={menuRef}>

              {/* AVATAR with image fallback */}
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-[#639922] text-white font-bold flex items-center justify-center overflow-hidden"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials || "U"}</span>
                )}
              </button>

              {/* DROPDOWN */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-white/10 bg-[#0b0c0e] text-white overflow-hidden shadow-lg">

                  {/* USER INFO */}
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-medium">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-white/40">
                      {profile?.email}
                    </p>
                    <p className="text-xs text-[#639922] capitalize">
                      {role ?? "user"}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      navigate(getDashboard());
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      navigate(getDashboard() + "/profile");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <Button
          className="md:hidden"
          variant="ghost"
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 p-4 text-white/70 space-y-3">

          <Link to="/jobs" onClick={() => setMobileOpen(false)}>
            Jobs
          </Link>

          {user && (
            <Link
              to={getDashboard()}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-400 block"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>

              <Link
                to="/register/student"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;