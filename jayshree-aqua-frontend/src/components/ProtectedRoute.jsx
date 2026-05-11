import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  // ⏳ While checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow access
  return <Outlet />;
}