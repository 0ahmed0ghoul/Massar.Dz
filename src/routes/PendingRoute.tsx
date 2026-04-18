import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";

const PendingRoute = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) return null;

  // 🔥 BLOCK pending users
  if (profile?.status === "pending") {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default PendingRoute;