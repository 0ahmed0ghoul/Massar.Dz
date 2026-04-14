import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

const RoleRoute = ({ allowedRoles }: Props) => {
  const { profile, isLoading } = useAuth();

  if (isLoading) return null;

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;