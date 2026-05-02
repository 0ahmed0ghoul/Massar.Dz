// layouts/DashboardLayout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Menu, ChevronLeft } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

type UserRole = "student" | "company_admin" | "university_admin" | "super_admin";

const roleColors: Record<UserRole, string> = {
  student: "#639922",
  company_admin: "#8B5CF6",
  university_admin: "#10B981",
  super_admin: "#EF4444",
};

interface Props {
  role: UserRole;
}

const DashboardLayout = ({ role }: Props) => {
  const { user, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch unread notification count with error handling
  useEffect(() => {
    if (!user) return;
    const fetchUnreadCount = async () => {
      try {
        // Adjust column name if needed (maybe 'profile_id' or 'user_id')
        // Using 'user_id' as fallback, but if it fails, we set to 0
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false);
        if (!error && count !== null) {
          setNotificationCount(count);
        } else if (error) {
          console.warn("Notification fetch error:", error);
          setNotificationCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch notification count:", err);
        setNotificationCount(0);
      }
    };
    fetchUnreadCount();

    // Optional: subscribe to changes, but with error handling
    let channel: any;
    try {
      channel = supabase
        .channel("notifications-count")
        .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => fetchUnreadCount())
        .subscribe();
    } catch (err) {
      console.warn("Failed to subscribe to notifications changes:", err);
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (profile) setIsProfileComplete(profile.is_completed === true);
    else setIsProfileComplete(false);
  }, [profile]);

  // Fetch pending count for super_admin (with error handling)
  useEffect(() => {
    if (role !== "super_admin") return;
    const fetchPendingCount = async () => {
      try {
        // Adjust column names if needed
        const { count: pendingInstitutions, error: instError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")
          .in("role", ["university_admin", "company_admin"]);
        if (instError) {
          console.warn("Error fetching pending institutions:", instError);
        }

        const { count: pendingStudents, error: studentError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student")
          .or(`is_completed.eq.false,status.eq.pending`);
        if (studentError) {
          console.warn("Error fetching pending students:", studentError);
        }

        setPendingCount((pendingInstitutions || 0) + (pendingStudents || 0));
      } catch (err) {
        console.error("Failed to fetch pending count:", err);
        setPendingCount(0);
      }
    };
    fetchPendingCount();

    let channel: any;
    try {
      channel = supabase
        .channel("pending-count")
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchPendingCount())
        .subscribe();
    } catch (err) {
      console.warn("Failed to subscribe to profiles changes:", err);
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [role]);

  const initials = (profile?.first_name?.[0] || "") + (profile?.last_name?.[0] || "");
  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();
  const email = profile?.email || "";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar
        role={role}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        notificationCount={notificationCount}
        isProfileComplete={isProfileComplete}
        pendingCount={pendingCount}
      />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1 text-foreground/60 hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex rounded-md p-1 text-foreground/60 hover:text-foreground"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium truncate max-w-[150px]">{fullName || "User"}</p>
              <p className="text-xs text-foreground/40 truncate max-w-[150px]">{email}</p>
            </div>
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
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;