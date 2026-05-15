// ✅ FILE: src/routes/AdminRoute.jsx
// This guards routes that ONLY admin can access.
// Teachers who try to access admin pages get redirected to /students

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // If not logged in at all → go to login
  if (!user) return <Navigate to="/login" replace />;

  // If logged in but NOT admin → go to students page
  if (user.role !== "admin") return <Navigate to="/students" replace />;

  // Is admin → show the page
  return children;
};

export default AdminRoute;