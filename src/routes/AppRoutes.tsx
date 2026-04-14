import { Routes, Route } from "react-router-dom";
import AuthCallback from "@/pages/AuthCallback";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/components/shared/DashboardLayout";

// PUBLIC
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";

// REGISTER PAGES (MISSING BEFORE)
import RegisterStudent from "@/pages/auth/RegisterStudent";
import RegisterCompany from "@/pages/auth/RegisterCompany";
import RegisterUniversity from "@/pages/auth/RegisterUniversity";

// STUDENT
import StudentDashboard from "@/features/student/pages/DashboardPage";
import ProfilePage from "@/features/student/pages/ProfilePage";
import JobsPage from "@/features/student/pages/JobsPage";
import ApplicationsPage from "@/features/student/pages/ApplicationsPage";

// OTHER ROLES
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import UniversityDashboard from "@/pages/university/UniversityDashboard";
import AdminDashboard from "@/features/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* 🔥 ADD REGISTER ROUTES HERE */}
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/company" element={<RegisterCompany />} />
      <Route path="/register/university" element={<RegisterUniversity />} />

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
          </Route>
        </Route>

        {/* ================= COMPANY ================= */}
        <Route element={<RoleRoute allowedRoles={["company_admin"]} />}>
          <Route element={<DashboardLayout role="company_admin" />}>
            <Route path="/dashboard/company" element={<CompanyDashboard />} />
          </Route>
        </Route>

        {/* ================= UNIVERSITY ================= */}
        <Route element={<RoleRoute allowedRoles={["university_admin"]} />}>
          <Route element={<DashboardLayout role="university_admin" />}>
            <Route
              path="/dashboard/university"
              element={<UniversityDashboard />}
            />
          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<RoleRoute allowedRoles={["super_admin"]} />}>
          <Route element={<DashboardLayout role="super_admin" />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
