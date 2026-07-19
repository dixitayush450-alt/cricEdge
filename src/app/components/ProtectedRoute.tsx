import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute() {
  const { isAuthenticated, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}