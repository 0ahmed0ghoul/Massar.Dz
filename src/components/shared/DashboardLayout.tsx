import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import LogoIcon from "@/assets/Logo-icon.jpg";
import { Menu, X, ChevronLeft, Clock, Paperclip, Star } from "lucide-react";
import univLogo from "@/assets/univ-guelma.png";
import {
  LayoutDashboard,
  User,
  FileText,
  Heart,
  Bell,
  Building2,
  Users,
  Search,
  BarChart3,
  LogOut,
  Briefcase,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type UserRole =
  | "student"
  | "company_admin"
  | "university_admin"
  | "super_admin";

/* ---------------- NAV CONFIG ---------------- */

const navMap: Record<UserRole, any[]> = {
  student: [
    { title: "Dashboard", url: "student/dashboard", icon: LayoutDashboard },
    { title: "Profile", url: "/student/dashboard/profile", icon: User },
    { title: "Certificate", url: "/student/dashboard/certificate", icon: Paperclip },
    { title: "Job Feed", url: "/student/dashboard/jobs", icon: Briefcase },
    { title: "Applications", url: "/student/dashboard/applications", icon: FileText },
    { title: "Saved Jobs", url: "/student/dashboard/saved", icon: Heart },
    { title: "Notifications", url: "/student/dashboard/notifications", icon: Bell },
  ],
  company_admin: [
    { title: "Dashboard", url: "/dashboard/company", icon: LayoutDashboard },
    { title: "Profile", url: "/dashboard/company/profile", icon: User },
    { title: "Jobs", url: "/dashboard/company/jobs", icon: Briefcase },
    { title: "Applications", url: "/dashboard/company/applications", icon: FileText },
    { title: "Talent", url: "/dashboard/company/talent", icon: Star },

  ],
  university_admin: [
    { title: "Dashboard", url: "/university/dashboard", icon: LayoutDashboard },
    { title: "Profile", url: "/university/dashboard/profile", icon: User },
    { title: "Students", url: "/university/dashboard/students", icon: Users },
    { title: "Invitations", url: "/university/dashboard/invitations", icon: Clock },
  ],
  super_admin: [
    { title: "Dashboard",    url: "/dashboard/admin",          icon: LayoutDashboard },
    { title: "Pending",      url: "/dashboard/admin/pending",  icon: Clock           },
    { title: "All Accounts", url: "/dashboard/admin/accounts", icon: Users           },
  ],
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  company_admin: "Employer",
  university_admin: "University",
  super_admin: "Admin",
};

const roleColors: Record<UserRole, string> = {
  student: "#639922",
  company_admin: "#8B5CF6",
  university_admin: "#10B981",
  super_admin: "#EF4444",
};

/* ---------------- SIDEBAR ---------------- */

interface AppSidebarProps {
  role: UserRole;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

function AppSidebar({ role, isOpen, isCollapsed, onClose }: AppSidebarProps) {
  const items = navMap[role];
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/login");
  };

  // Width classes: full on mobile, w-64 on desktop when expanded, w-20 when collapsed
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const mobileWidth = "w-full"; // on mobile, sidebar takes full width

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen transform border-r border-white/10 
          bg-[#0b0c0e] text-white transition-all duration-300 ease-in-out
          md:relative
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${sidebarWidth}
          ${isOpen ? mobileWidth : ""}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={`flex items-center border-b border-white/10 p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/`)}>
                <img src={LogoIcon} className="h-5 w-5" alt="Logo" />
                <span className="font-bold">Massar</span>
                <span className="text-white/40 text-sm">{roleLabels[role]}</span>
              </div>
            )}
            {isCollapsed && (
              <img src={LogoIcon} className="h-5 w-5 cursor-pointer" onClick={() => navigate(`/`)} alt="Logo" />
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1 text-white/60 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {items.map((item) => {
              const active = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className={`p-3 border-t border-white/10 ${isCollapsed ? "text-center" : ""}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-red-400 text-sm ${isCollapsed ? "justify-center w-full" : ""}`}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------- LAYOUT ---------------- */

interface Props {
  role: UserRole;
}

const DashboardLayout = ({ role }: Props) => {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const initials = (profile?.first_name?.[0] || "") + (profile?.last_name?.[0] || "");
  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();
  const email = profile?.email || "";

  return (
    <div className="flex min-h-screen bg-[#0b0c0e] text-white">
      <AppSidebar
        role={role}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 flex items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1 text-white/60 hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Desktop collapse/expand button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex rounded-md p-1 text-white/60 hover:text-white"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* User info – responsive text */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium truncate max-w-[150px]">{fullName || "User"}</p>
              <p className="text-xs text-white/40 truncate max-w-[150px]">{email}</p>
            </div>
            {/* Always show avatar, but hide text on very small */}
            <div className="text-right block sm:hidden">
              <p className="text-sm font-medium">{fullName?.split(' ')[0] || "User"}</p>
            </div>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                style={{ background: roleColors[role] }}
              >
                {initials || "U"}
              </div>
            )}
          </div>
        </header>

        {/* Main content – responsive padding */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;