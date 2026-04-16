import { Routes, Route } from "react-router-dom";
import AuthCallback from "@/pages/AuthCallback";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/components/shared/DashboardLayout";

// ADMIN

// PUBLIC
import Landing from "@/pages/Landing";

// STUDENT
import StudentDashboard from "@/features/student/pages/DashboardPage";
import ProfilePage from "@/features/student/pages/ProfilePage";
import JobsPage from "@/features/student/pages/JobsPage";
import ApplicationsPage from "@/features/student/pages/ApplicationsPage";

// OTHER ROLES
import CompanyDashboard from "@/features/employer/pages/CompanyDashboard";
import UniversityDashboard from "@/features/student copy/pages/UniversityDashboard";

import Login from "@/features/auth/pages/Login";
import NotificationsPage from "@/features/student/pages/NotificationsPage";
import Register from "@/features/auth/pages/Register";
import PendingApproval from "@/features/auth/pages/PendingApproval";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminPendingPage } from "@/features/admin/pages/AdminPendingPage";
import { AdminAccountsPage } from "@/features/admin/pages/AdminAccountsPage";


const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* 🔥 ADD REGISTER ROUTES HERE */}
      <Route path="/register" element={<Register />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        {/* ============= OAuth callback ==================== */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ================= STUDENT ================= */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route
              path="/dashboard/student/profile"
              element={<ProfilePage />}
            />
            <Route path="/dashboard/student/jobs" element={<JobsPage />} />
            <Route
              path="/dashboard/student/applications"
              element={<ApplicationsPage />}
            />
            {/* Example of duplicate route - consider removing or changing path */}
            <Route
              path="/dashboard/student/saved"
              element={<ApplicationsPage />}
            />
            <Route
              path="/dashboard/student/notifications"
              element={<NotificationsPage />}
            />
          </Route>
        </Route>

        {/* ================= COMPANY ================= */}
        <Route element={<RoleRoute allowedRoles={["company_admin"]} />}>
          <Route element={<DashboardLayout role="company_admin" />}>
            <Route path="/dashboard/company" element={<CompanyDashboard />} />
          </Route>
        </Route>

        {/* ================= UNIVERSITY ================= */}
        <Route element={<RoleRoute allowedRoles={["pending_university"]} />}>
          <Route element={<DashboardLayout role="pending_university" />}>
            <Route
              path="/dashboard/university"
              element={<UniversityDashboard />}
            />
          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<DashboardLayout role="super_admin" />}>
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard/admin/pending" element={<AdminPendingPage />} />
          <Route path="/dashboard/admin/accounts" element={<AdminAccountsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
