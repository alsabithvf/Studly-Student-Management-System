// ✅ FILE: src/routes/ProtectedRoute.jsx
// This component GUARDS routes from unauthenticated users.
// If not logged in → redirect to /login
// If logged in → show the page normally

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // get current logged-in user

  // If no user is logged in, send them to login page
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise render the actual page
  return children;
};

export default ProtectedRoute;