// components/DashboardSidebar.tsx (updated)
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import LogoIcon from "@/assets/Logo-icon.jpg";
import { X, ChevronLeft, LogOut, LayoutDashboard, User, Briefcase, FileText, Star, Clock, MessageCircleMore, Bell, Heart, Paperclip, Users, Wallet } from "lucide-react";

interface DashboardSidebarProps {
  role: UserRole;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  notificationCount: number;
  isProfileComplete: boolean;
  pendingCount: number;
}

type UserRole = "student" | "company_admin" | "university_admin" | "super_admin";

const navMap: Record<UserRole, any[]> = {
  student: [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Profile", url: "/student/dashboard/profile", icon: User },
    { title: "Certificates", url: "/student/dashboard/certificate", icon: Paperclip },
    { title: "Job Feed", url: "/student/dashboard/jobs", icon: Briefcase },
    { title: "Applications", url: "/student/dashboard/applications", icon: FileText },
    { title: "Saved Jobs", url: "/student/dashboard/saved", icon: Heart },
    { title: "Messages", url: "/student/dashboard/messages", icon: MessageCircleMore },
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
    { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Pending", url: "/dashboard/admin/pending", icon: Clock },
    { title: "All Accounts", url: "/dashboard/admin/accounts", icon: Users },
    { title: "Payments", url: "/dashboard/admin/Payments", icon: Wallet },

  ],
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  company_admin: "Employer",
  university_admin: "University",
  super_admin: "Admin",
};

export function DashboardSidebar({
  role,
  isOpen,
  isCollapsed,
  onClose,
  notificationCount,
  isProfileComplete,
  pendingCount,
}: DashboardSidebarProps) {
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
  const mobileWidth = "w-full";

  // Separate badge for notifications (only when > 0)
  const showNotificationBadge = notificationCount > 0;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen transform border-r border-white/10 
          bg-background text-foreground transition-all duration-300 ease-in-out
          md:relative
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${sidebarWidth}
          ${isOpen ? mobileWidth : ""}
        `}
      >
        <div className="flex h-full flex-col">
          <div className={`flex items-center border-b border-white/10 p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img src={LogoIcon} className="h-5 w-5" alt="Logo" />
                <span className="font-bold">Massar</span>
                <span className="text-foreground/40 text-sm">{roleLabels[role]}</span>
              </div>
            )}
            {isCollapsed && (
              <img src={LogoIcon} className="h-5 w-5 cursor-pointer" onClick={() => navigate("/")} alt="Logo" />
            )}
            <button onClick={onClose} className="rounded-md p-1 text-foreground/60 hover:text-foreground md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {items.map((item) => {
              const active = location.pathname === item.url;
              const isNotifications = item.title === "Notifications";
              const isPending = item.title === "Pending";

              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active ? "bg-white/10 text-foreground" : "text-foreground/50 hover:text-foreground"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className="relative">
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {isNotifications && showNotificationBadge && (
                      <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                    {isPending && role === "super_admin" && pendingCount > 0 && (
                      <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-black">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                  </div>
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