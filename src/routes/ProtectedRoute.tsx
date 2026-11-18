import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FullPageSpinner } from "../components/common/Spinner";
import { dashboardPath } from "../components/layout/Navbar";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

/** Route guard. UI-level only – the API independently enforces every permission. */
export const ProtectedRoute = ({ roles }: { roles: Role[] }) => {
  const { user, initialized } = useAuth();
  const location = useLocation();
  if (!initialized) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;
  return <Outlet />;
};

export const GuestRoute = () => {
  const { user, initialized } = useAuth();
  if (!initialized) return <FullPageSpinner />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;
  return <Outlet />;
};
