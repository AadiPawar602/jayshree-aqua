import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 🔹 wait until auth loads
  if (loading) return <div>Loading...</div>;

  // 🔹 not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 allowed
  return children;
};

export default ProtectedRoute;