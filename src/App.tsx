import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterCompany from "./pages/auth/RegisterCompany";
import RegisterUniversity from "./pages/auth/RegisterUniversity";
import JobBoard from "./pages/public/JobBoard";
import JobDetail from "./pages/public/JobDetail";
import DashboardLayout from "./components/shared/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import UniversityDashboard from "./pages/university/UniversityDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/register/university" element={<RegisterUniversity />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Student Dashboard */}
          <Route path="/dashboard/student" element={<DashboardLayout role="student"><StudentDashboard /></DashboardLayout>} />
          <Route path="/dashboard/student/*" element={<DashboardLayout role="student"><StudentDashboard /></DashboardLayout>} />

          {/* Company Dashboard */}
          <Route path="/dashboard/company" element={<DashboardLayout role="company_admin"><CompanyDashboard /></DashboardLayout>} />
          <Route path="/dashboard/company/*" element={<DashboardLayout role="company_admin"><CompanyDashboard /></DashboardLayout>} />

          {/* University Dashboard */}
          <Route path="/dashboard/university" element={<DashboardLayout role="university_admin"><UniversityDashboard /></DashboardLayout>} />
          <Route path="/dashboard/university/*" element={<DashboardLayout role="university_admin"><UniversityDashboard /></DashboardLayout>} />

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<DashboardLayout role="super_admin"><AdminDashboard /></DashboardLayout>} />
          <Route path="/dashboard/admin/*" element={<DashboardLayout role="super_admin"><AdminDashboard /></DashboardLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
