import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Login from "./pages/Login";
import SetupPassword from "./pages/SetupPassword";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import AddCourse from "./pages/AddCourse";
import ManageTeachers from "./pages/ManageTeachers";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup-password" element={<SetupPassword />} />

          {/* Admin only */}
          <Route path="/dashboard"         element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/manage-teachers"   element={<AdminRoute><ManageTeachers /></AdminRoute>} />
          <Route path="/add-course"        element={<AdminRoute><AddCourse /></AdminRoute>} />

          {/* Both roles */}
          <Route path="/students"          element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/add-student"       element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
          <Route path="/edit-student/:id"  element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
          <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;