import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink as NavLinkComponent } from "@/components/NavLink";
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
  Briefcase, LayoutDashboard, User, FileText, Heart, Bell,
  Building2, Users, Search, BarChart3, CreditCard,
  GraduationCap, Upload, Target, School, Settings, Shield, LogOut
} from "lucide-react";
import type { UserRole } from "@/types/app.types";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/student/profile", icon: User },
  { title: "Job Feed", url: "/dashboard/student/jobs", icon: Briefcase },
  { title: "Applications", url: "/dashboard/student/applications", icon: FileText },
  { title: "Saved Jobs", url: "/dashboard/student/saved", icon: Heart },
  { title: "Notifications", url: "/dashboard/student/notifications", icon: Bell },
];

const companyNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/company", icon: LayoutDashboard },
  { title: "Company Profile", url: "/dashboard/company/profile", icon: Building2 },
  { title: "Jobs", url: "/dashboard/company/jobs", icon: Briefcase },
  { title: "Candidates", url: "/dashboard/company/candidates", icon: Search },
  { title: "Applications", url: "/dashboard/company/applications", icon: Users },
  { title: "Analytics", url: "/dashboard/company/analytics", icon: BarChart3 },
  { title: "Subscription", url: "/dashboard/company/billing", icon: CreditCard },
];

const universityNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard/university", icon: LayoutDashboard },
  { title: "Import Students", url: "/dashboard/university/import", icon: Upload },
  { title: "Student Directory", url: "/dashboard/university/students", icon: Users },
  { title: "Outcomes", url: "/dashboard/university/outcomes", icon: Target },
  { title: "Analytics", url: "/dashboard/university/analytics", icon: BarChart3 },
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

function AppSidebar({ role }: { role: UserRole }) {
  const items = navMap[role];
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">
            {!collapsed && (
              <Link to="/" className="flex items-center gap-2 font-bold">
                <div className="gradient-primary rounded p-1">
                  <Briefcase className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                RecruitHub
              </Link>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLinkComponent
                      to={item.url}
                      end={item.url === `/dashboard/${role === 'company_admin' ? 'company' : role === 'university_admin' ? 'university' : role === 'super_admin' ? 'admin' : 'student'}`}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex w-full items-center text-muted-foreground hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Sign Out</span>}
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
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              {roleLabels[role]}
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
