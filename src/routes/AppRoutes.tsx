import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/components/shared/DashboardLayout";

import Landing from "@/features/landing/pages/Landing";
import StudentDashboard from "@/features/student/pages/DashboardPage";
import ApplicationsPage from "@/features/student/pages/ApplicationsPage";
import CompanyDashboard from "@/features/company/pages/CompanyDashboard";
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
import InvitationsPage from "@/features/university/pages/InvitaionPage";
import UniversityProfilePage from "@/features/university/pages/ProfilePage";
import CompanyProfilePage from "@/features/company/pages/CompanyProfilePage";
import CompanyApplicationsPage from "@/features/company/pages/ApplicationsPage";
import TalentPage from "@/features/company/pages/TalentPage";
import CompanyJobsPage from "@/features/company/pages/JobsPage";
import { InboxPage } from "@/features/messaging/pages/InboxPage";
import { ConversationPage } from "@/features/messaging/pages/ConversationPage";
import { AdminPendingDetailPage } from "@/features/admin/pages/AdminPendingDetailPage";
import MessagesPage from "@/features/student/pages/MessagesPage";
import JobsPage from "@/features/jobs/pages/JobsPage";
import StudentJobsPage from "@/features/student/pages/JobsPage";
import InternshipsPage from "@/features/internships/pages/InternshipsPage";
import JobDetailPage from "@/features/jobs/pages/JobDetailPage";
import InternshipDetailPage from "@/features/internships/pages/InternshipDetailPage";
import AuthPage from "@/features/auth/pages/AuthPage";

import { useAuth } from "@/features/auth/contexts/AuthContext";

import { Navigate } from "react-router-dom";
import UniversityCompleteProfilePage from "@/features/auth/pages/UniversityCompleteProfilePage";
import CompanyCompleteProfilePage from "@/features/auth/pages/CompanyCompleteProfilePage";
import PricingPage from "@/features/landing/pages/PricingPage";
import PaymentPage from "@/features/landing/pages/PaymentPage";
import AdminPaymentsPage from "@/features/admin/pages/AdminPaymentsPage";

function CompleteProfileRouter() {
  const { profile, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <Navigate to="/login" />;

  if (profile.role === "university_admin") {
    return <UniversityCompleteProfilePage />;
  } else if (profile.role === "company_admin") {
    return <CompanyCompleteProfilePage />;
  } else {
    return <Navigate to="/dashboard" />;
  }
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/complete-profile" element={<CompleteProfileRouter />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/internships" element={<InternshipsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/internships/:id" element={<InternshipDetailPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/payment/:paymentId" element={<PaymentPage />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        {/* ================= STUDENT ================= */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/dashboard/profile"
              element={<ProfilePage />}
            />
            <Route
              path="/student/dashboard/jobs"
              element={<StudentJobsPage />}
            />
            <Route
              path="/student/dashboard/applications"
              element={<ApplicationsPage />}
            />
            <Route
              path="/student/dashboard/saved"
              element={<ApplicationsPage />}
            />
            <Route
              path="/student/dashboard/notifications"
              element={<NotificationsPage />}
            />
            <Route
              path="/student/dashboard/messages"
              element={<MessagesPage />}
            />
            <Route
              path="/student/dashboard/certificate"
              element={<CertificatePage />}
            />
          </Route>
        </Route>

        {/* ================= COMPANY ================= */}
        <Route element={<RoleRoute allowedRoles={["company_admin"]} />}>
          <Route element={<PendingRoute />}>
            <Route element={<DashboardLayout role="company_admin" />}>
              <Route path="/dashboard/company" element={<CompanyDashboard />} />
              <Route
                path="/dashboard/company/jobs"
                element={<CompanyJobsPage />}
              />
              <Route
                path="/dashboard/company/talent"
                element={<TalentPage />}
              />
              <Route
                path="/dashboard/company/applications"
                element={<CompanyApplicationsPage />}
              />
              <Route
                path="/dashboard/company/profile"
                element={<CompanyProfilePage />}
              />
            </Route>
          </Route>
        </Route>

        {/* ================= UNIVERSITY ================= */}
        <Route element={<RoleRoute allowedRoles={["university_admin"]} />}>
          <Route element={<PendingRoute />}>
            University of Example
            <Route element={<DashboardLayout role="university_admin" />}>
              <Route
                path="/university/dashboard"
                element={<UniversityDashboard />}
              />
              <Route
                path="/university/dashboard/students"
                element={<StudentsPage />}
              />
              <Route
                path="/university/dashboard/profile"
                element={<UniversityProfilePage />}
              />
              <Route
                path="/university/dashboard/invitations"
                element={<InvitationsPage />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/messages" element={<InboxPage />} />
        <Route path="/messages/:id" element={<ConversationPage />} />

        {/* ================= ADMIN ================= */}
        <Route element={<DashboardLayout role="super_admin" />}>
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          <Route
            path="/dashboard/admin/pending"
            element={<AdminPendingPage />}
          />
          <Route
            path="dashboard/admin/pending/:id"
            element={<AdminPendingDetailPage />}
          />
          <Route
            path="/dashboard/admin/accounts"
            element={<AdminAccountsPage />}
          />
          <Route
            path="/dashboard/admin/payments"
            element={<AdminPaymentsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
