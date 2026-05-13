import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/components/shared/DashboardLayout";

import Landing from "@/features/landing/pages/Landing";
import StudentDashboard from "@/features/student/pages/DashboardPage";
import CompanyDashboard from "@/features/company/pages/CompanyDashboard";
import NotificationsPage from "@/features/student/pages/NotificationsPage";
import PendingApproval from "@/features/auth/pages/PendingApproval";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminPendingPage } from "@/features/admin/pages/AdminPendingPage";
import { AdminAccountsPage } from "@/features/admin/pages/AdminAccountsPage";
import StudentsPage from "@/features/department/pages/StudentsPage";
import UniversityDashboard from "@/features/department/pages/Dashboard";
import CertificatePage from "@/features/student/pages/CertificatePage";
import PendingRoute from "./PendingRoute";
import ProfilePage from "@/features/student/pages/ProfilePage";
import InvitationsPage from "@/features/department/pages/InvitaionsPage";
import UniversityProfilePage from "@/features/university/pages/ProfilePage";
import CompanyProfilePage from "@/features/company/pages/CompanyProfilePage";
import CompanyApplicationsPage from "@/features/company/pages/ApplicationsPage";
import TalentPage from "@/features/company/pages/TalentPage";
import CompanyJobsPage from "@/features/company/pages/JobsPage";
import { AdminPendingDetailPage } from "@/features/admin/pages/AdminPendingDetailPage";
import MessagesPage from "@/features/student/pages/MessagesPage";
import JobsPage from "@/features/landing/pages/JobsPage";
import JobDetailPage from "@/features/landing/pages/JobDetailPage";
import AuthPage from "@/features/auth/pages/AuthPage";

import { useAuth } from "@/features/auth/contexts/AuthContext";

import { Navigate } from "react-router-dom";
import UniversityCompleteProfilePage from "@/features/auth/pages/UniversityCompleteProfilePage";
import CompanyCompleteProfilePage from "@/features/auth/pages/CompanyCompleteProfilePage";
import PricingPage from "@/features/landing/pages/PricingPage";
import PaymentPage from "@/features/landing/pages/PaymentPage";
import AdminPaymentsPage from "@/features/admin/pages/AdminPaymentsPage";
import NotFound from "@/pages/NotFound";
import CertificateRequestsPage from "@/features/department/pages/CertificateRequests";
import SkillsPage from "@/features/student/pages/SkillsPage";
import CompanyPublicProfilePage from "@/features/landing/pages/CompanyPublicProfilePage";
import ExperiencePage from "@/features/student/pages/ExperiencePage";
import FeedbacksPage from "@/features/admin/pages/FeedbacksPage";
import ApplicationDetailPage from "@/features/company/pages/ApplicationDetailPage";
import DashboardRedirectPage from "@/pages/DashboardRedirectPage";
import QuestionAnswerPage from "@/features/admin/pages/QuestionAnswerPage";
import StudentQAPage from "@/features/student/pages/StudentQAPage";
import UnifiedAnalyticsPage from "@/features/university/pages/UnifiedAnalyticsPage";
import UniversityChatPage from "@/features/department/pages/Chat";

function CompleteProfileRouter() {
  const { profile, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <Navigate to="/login" />;

  if (profile.role === "university_admin") {
    return <UniversityCompleteProfilePage />;
  } else if (profile.role === "company_admin") {
    return <CompanyCompleteProfilePage />;
  } else {
    return <Navigate to="/student/dashboard" />;
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
      <Route path="/experience" element={<JobsPage />} />
      <Route path="/experience/:id" element={<JobDetailPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/payment/:paymentId" element={<PaymentPage />} />
      <Route path="/companies/:id" element={<CompanyPublicProfilePage />} />
      <Route path="/dashboard" element={<DashboardRedirectPage />} />

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
              path="/student/dashboard/experience"
              element={<ExperiencePage />}
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
            <Route path="/student/dashboard/skills" element={<SkillsPage />} />
            <Route path="/student/dashboard/qa" element={<StudentQAPage />} />
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
                path="/company/dashboard/applications"
                element={<CompanyApplicationsPage />}
              />

              <Route
                path="/company/dashboard/application"
                element={<ApplicationDetailPage />}
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

            <Route element={<DashboardLayout role="university_admin" />}>

              <Route path="/university/dashboard" element={<UniversityDashboard />}/>
              <Route path="/university/dashboard/profile" element={<UniversityProfilePage />}/>
              <Route path="/university/statistics" element={<UniversityProfilePage />}/>
              <Route path="/university/analytics" element={<UnifiedAnalyticsPage />} />
              <Route path="/university/analytics/:universityName/:speciality" element={<UnifiedAnalyticsPage />} />

              <Route path="/department/dashboard/students" element={<StudentsPage />}/>
              <Route path="/department/dashboard/certificates" element={<CertificateRequestsPage />}/>
              <Route path="/department/dashboard/invitations" element={<InvitationsPage />}/>
              <Route path="/department/dashboard/chat" element={<UniversityChatPage />}/> 

</Route>
          </Route>
        </Route>

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
          <Route path="dashboard/admin/feedbacks" element={<FeedbacksPage />} />
          <Route
            path="/dashboard/admin/questionanswer"
            element={<QuestionAnswerPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
