// src/lib/auth/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// PrivateRoute component to protect routes based on user roles
export default function PrivateRoute({ allowedRoles }) {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
