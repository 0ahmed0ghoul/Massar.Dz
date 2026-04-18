import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/components/shared/DashboardLayout";

import Landing from "@/features/landing/pages/Landing";
import StudentDashboard from "@/features/student/pages/DashboardPage";
import JobsPage from "@/features/student/pages/JobsPage";
import ApplicationsPage from "@/features/student/pages/ApplicationsPage";
import CompanyDashboard from "@/features/employer/pages/CompanyDashboard";
import Login from "@/features/auth/pages/Login";
import NotificationsPage from "@/features/student/pages/NotificationsPage";
import Register from "@/features/auth/pages/Register";
import PendingApproval from "@/features/auth/pages/PendingApproval";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminPendingPage } from "@/features/admin/pages/AdminPendingPage";
import { AdminAccountsPage } from "@/features/admin/pages/AdminAccountsPage";
import StudentsPage from "@/features/university/pages/StudentsPage";
import UniversityDashboard from "@/features/university/pages/Dashboard";
import CertificatePage from "@/features/student/pages/CertificatePage";
import PendingRoute from "./PendingRoute";
import ProfilePage from "@/features/student/pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>

        {/* ================= STUDENT ================= */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/dashboard/profile" element={<ProfilePage />} />
            <Route path="/student/dashboard/jobs" element={<JobsPage />} />
            <Route path="/student/dashboard/applications" element={<ApplicationsPage />} />
            <Route path="/student/dashboard/saved" element={<ApplicationsPage />} />
            <Route path="/student/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/student/dashboard/certificate" element={<CertificatePage />} />
          </Route>
        </Route>

        {/* ================= COMPANY ================= */}
        <Route element={<RoleRoute allowedRoles={["company_admin"]} />}>
          <Route element={<PendingRoute />}>
            <Route element={<DashboardLayout role="company_admin" />}>
              <Route path="/dashboard/company" element={<CompanyDashboard />} />
            </Route>

          </Route>
        </Route>

        {/* ================= UNIVERSITY ================= */}
        <Route element={<RoleRoute allowedRoles={["university_admin"]} />}>
          <Route element={<PendingRoute />}>
            <Route element={<DashboardLayout role="university_admin" />}>
              <Route path="/university/dashboard" element={<UniversityDashboard />} />
              <Route path="/university/dashboard/students" element={<StudentsPage />} />
            </Route>
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
