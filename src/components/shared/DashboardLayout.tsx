import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Briefcase,
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
  GraduationCap,
  Upload,
  Target,
  School,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import LogoIcon from "@/assets/Logo-icon.jpg";

type UserRole =
  | "student"
  | "company_admin"
  | "university_admin"
  | "super_admin";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/student/profile", icon: User },
  { title: "Job Feed", url: "/dashboard/student/jobs", icon: Briefcase },
  {
    title: "Applications",
    url: "/dashboard/student/applications",
    icon: FileText,
  },
  { title: "Saved Jobs", url: "/dashboard/student/saved", icon: Heart },
  {
    title: "Notifications",
    url: "/dashboard/student/notifications",
    icon: Bell,
  },
];

const companyNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/company", icon: LayoutDashboard },
  {
    title: "Company Profile",
    url: "/dashboard/company/profile",
    icon: Building2,
  },
  { title: "Jobs", url: "/dashboard/company/jobs", icon: Briefcase },
  { title: "Candidates", url: "/dashboard/company/candidates", icon: Search },
  {
    title: "Applications",
    url: "/dashboard/company/applications",
    icon: Users,
  },
  { title: "Analytics", url: "/dashboard/company/analytics", icon: BarChart3 },
  {
    title: "Subscription",
    url: "/dashboard/company/billing",
    icon: CreditCard,
  },
];

const universityNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/university", icon: LayoutDashboard },
  {
    title: "Import Students",
    url: "/dashboard/university/import",
    icon: Upload,
  },
  {
    title: "Student Directory",
    url: "/dashboard/university/students",
    icon: Users,
  },
  { title: "Outcomes", url: "/dashboard/university/outcomes", icon: Target },
  {
    title: "Analytics",
    url: "/dashboard/university/analytics",
    icon: BarChart3,
  },
  { title: "Settings", url: "/dashboard/university/settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Universities", url: "/dashboard/admin/universities", icon: School },
  { title: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
  { title: "Users", url: "/dashboard/admin/users", icon: Users },
  { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
];

const navMap: Record<UserRole, NavItem[]> = {
  student: studentNav,
  company_admin: companyNav,
  university_admin: universityNav,
  super_admin: adminNav,
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

const roleGradients: Record<UserRole, string> = {
  student: "from-[#639922] to-[#4f7a1a]",
  company_admin: "from-purple-500 to-pink-500",
  university_admin: "from-emerald-500 to-teal-500",
  super_admin: "from-red-500 to-orange-500",
};

function AppSidebar({ role }: { role: UserRole }) {
  const items = navMap[role];
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { toast } = useToast();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="!bg-[#0b0c0e] border-r border-white/[0.09] text-white">
      {" "}
      {/* Grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <SidebarContent className="relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 py-6">
            {!collapsed && (
              <Link
                to="/"
                className="flex items-center gap-2 font-bold text-white"
              >
                <img src={LogoIcon} alt="Massar Logo" className="h-5 w-5" />
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Massar
                </span>
                {roleLabels[role].toLowerCase()}
              </Link>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-white/[0.08] text-white shadow-sm"
                            : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        <item.icon
                          className="h-4 w-4 transition-all"
                        />
                        {!collapsed && (
                          <span className="text-sm">
                            {item.title}
                            {isActive && (
                              <span
                                className="ml-2 inline-block h-1.5 w-1.5 rounded-full"
                                style={{ background: roleColors[role] }}
                              />
                            )}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 transition-all group-hover:scale-110" />
                    {!collapsed && <span className="text-sm">Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
}

const DashboardLayout = ({ role, children }: DashboardLayoutProps) => {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="relative min-h-screen flex w-full !bg-[#0b0c0e]">
        {/* Global grid texture */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Role-specific glow orb */}
        <div
          className="pointer-events-none fixed -top-32 right-0 h-96 w-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: roleColors[role] }}
        />

        <AppSidebar role={role} />

        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="sticky top-0 z-40 h-14 flex items-center justify-between border-b border-white/[0.09] bg-[#0b0c0e]/80 backdrop-blur-md px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-white/60 hover:text-white transition-colors" />
              {/* Animated indicator */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">
                    Dashboard
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Role badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: roleColors[role] }}
                />
                <span className="text-xs font-medium text-white/70">
                  {roleLabels[role]}
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-white">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-[10px] text-white/40">{profile?.email}</p>
                </div>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}cc)`,
                  }}
                >
                  <span className="text-xs font-bold text-white">
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
