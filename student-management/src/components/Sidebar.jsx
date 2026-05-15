import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiChartBar,
  HiUsers,
  HiUserPlus,
  HiAcademicCap,
  HiBookOpen,
  HiUser,
  HiXMark,
} from "react-icons/hi2";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const getStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#4b5563",
    background: isActive ? "#0d9488" : "transparent",
    transition: "all 0.15s",
  });

  const sectionLabel = (text) => (
    <p style={{
      fontSize: "11px", fontWeight: "600", color: "#9ca3af",
      textTransform: "uppercase", letterSpacing: "0.8px",
      padding: "4px 12px 8px", margin: 0,
    }}>
      {text}
    </p>
  );

  const divider = (
    <div style={{ borderTop: "1px solid #f3f4f6", margin: "8px 0" }} />
  );

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 40, display: "block",
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          width: "220px",
          minHeight: "100vh",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flexShrink: 0,
          // Mobile: fixed drawer behaviour
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
        // On lg+ screens override to static positioning via className
        className="lg:static lg:translate-x-0 lg:transition-none"
      >
        {/* Close button — mobile only */}
        <div
          className="flex justify-end mb-2 lg:hidden"
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none",
              cursor: "pointer", color: "#6b7280", padding: "4px",
            }}
          >
            <HiXMark size={20} />
          </button>
        </div>

        {sectionLabel("Menu")}

        {isAdmin && (
          <NavLink to="/dashboard" style={getStyle} onClick={handleLinkClick}>
            <HiChartBar size={16} /> Dashboard
          </NavLink>
        )}

        <NavLink to="/students" style={getStyle} onClick={handleLinkClick}>
          <HiUsers size={16} /> Students
        </NavLink>
        <NavLink to="/add-student" style={getStyle} onClick={handleLinkClick}>
          <HiUserPlus size={16} /> Add Student
        </NavLink>

        {isAdmin && (
          <>
            {divider}
            {sectionLabel("Admin")}
            <NavLink to="/manage-teachers" style={getStyle} onClick={handleLinkClick}>
              <HiAcademicCap size={16} /> Manage Teachers
            </NavLink>
            <NavLink to="/add-course" style={getStyle} onClick={handleLinkClick}>
              <HiBookOpen size={16} /> Manage Courses
            </NavLink>
          </>
        )}

        {divider}
        {sectionLabel("Account")}
        <NavLink to="/profile" style={getStyle} onClick={handleLinkClick}>
          <HiUser size={16} /> My Profile
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;