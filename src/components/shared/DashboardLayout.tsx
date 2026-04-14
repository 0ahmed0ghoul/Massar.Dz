import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import LogoIcon from "@/assets/Logo-icon.jpg";

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
  CreditCard,
  Upload,
  Target,
  School,
  Settings,
  LogOut,
  Zap,
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
  university_admin: [
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

function AppSidebar({ role }: { role: UserRole }) {
  const items = navMap[role];
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/login");
  };

  return (
    <div className="w-64 border-r border-white/10 bg-[#0b0c0e] text-white">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <img src={LogoIcon} className="h-5 w-5" />
        <span className="font-bold">Massar</span>
        <span className="text-white/40 text-sm">{roleLabels[role]}</span>
      </div>

      <div className="p-3 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 text-sm"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

/* ---------------- LAYOUT ---------------- */

interface Props {
  role: UserRole;
}

const DashboardLayout = ({ role }: Props) => {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0b0c0e] text-white">
        {/* Sidebar */}
        <AppSidebar role={role} />

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b border-white/10 px-4">
            <SidebarTrigger />

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60">{roleLabels[role]}</span>

              <div className="text-right">
                <p className="text-sm">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-white/40">{profile?.email}</p>
              </div>

              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: roleColors[role] }}
              >
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </div>
            </div>
          </header>

          {/* CONTENT (IMPORTANT PART) */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;