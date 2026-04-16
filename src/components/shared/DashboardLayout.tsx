import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import LogoIcon from "@/assets/Logo-icon.jpg";
import { Menu, X, ChevronLeft } from "lucide-react";

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
  | "pending_university"
  | "super_admin";

/* ---------------- NAV CONFIG ---------------- */

const navMap: Record<UserRole, any[]> = {
  student: [
    { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
    { title: "Profile", url: "/dashboard/student/profile", icon: User },
    { title: "Job Feed", url: "/dashboard/student/jobs", icon: Briefcase },
    { title: "Applications", url: "/dashboard/student/applications", icon: FileText },
    { title: "Saved Jobs", url: "/dashboard/student/saved", icon: Heart },
    { title: "Notifications", url: "/dashboard/student/notifications", icon: Bell },
  ],
  company_admin: [
    { title: "Dashboard", url: "/dashboard/company", icon: LayoutDashboard },
    { title: "Jobs", url: "/dashboard/company/jobs", icon: Briefcase },
    { title: "Candidates", url: "/dashboard/company/candidates", icon: Search },
  ],
  pending_university: [
    { title: "Dashboard", url: "/dashboard/university", icon: LayoutDashboard },
    { title: "Students", url: "/dashboard/university/students", icon: Users },
  ],
  super_admin: [
    { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Users", url: "/dashboard/admin/users", icon: Users },
    { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
  ],
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  company_admin: "Employer",
  pending_university: "University",
  super_admin: "Admin",
};

const roleColors: Record<UserRole, string> = {
  student: "#639922",
  company_admin: "#8B5CF6",
  pending_university: "#10B981",
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

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

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
  className={`fixed top-0 left-0 z-50 h-screen transform border-r border-white/10 bg-[#0b0c0e] text-white transition-all duration-300 ease-in-out md:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${sidebarWidth}`}
      >
        <div className="flex h-full flex-col">
          <div className={`flex items-center border-b border-white/10 p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2" onClick={() => navigate(`/`)} style={{ cursor: "pointer" }}>
                <img src={LogoIcon} className="h-5 w-5" />
                <span className="font-bold">Massar</span>
                <span className="text-white/40 text-sm">{roleLabels[role]}</span>
              </div>
            )}
            {isCollapsed && (
              <img src={LogoIcon} className="h-5 w-5" onClick={() => navigate(`/`)} style={{ cursor: "pointer" }}/>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1 text-white/60 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

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

  return (
    <div className="flex min-h-screen bg-[#0b0c0e] text-white">
      <AppSidebar
        role={role}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1 text-white/60 hover:text-white md:hidden"
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

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-white/40">{profile?.email}</p>
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

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;