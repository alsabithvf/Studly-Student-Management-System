import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiAcademicCap, HiArrowRightOnRectangle, HiBars3 } from "react-icons/hi2";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const home = user?.role === "admin" ? "/dashboard" : "/students";

  return (
    <header style={{
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      padding: "0 16px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>

      {/* ── Left: Hamburger (mobile) + Clickable title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{
            background: "transparent", border: "none",
            cursor: "pointer", color: "#374151",
            padding: "4px", display: "flex", alignItems: "center",
          }}
          aria-label="Open menu"
        >
          <HiBars3 size={24} />
        </button>

        <div
          onClick={() => navigate(home)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            cursor: "pointer", userSelect: "none",
          }}
        >
          <div style={{
            width: "34px", height: "34px", borderRadius: "8px",
            background: "linear-gradient(135deg, #0d9488, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <HiAcademicCap size={20} color="#ffffff" />
          </div>

          <div style={{ lineHeight: "1.2" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
              Studly
            </p>
            <p style={{ margin: 0, fontSize: "10px", fontWeight: "500", color: "#94a3b8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Student Portal
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: User info + Logout ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0d9488, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "14px", fontWeight: "600", flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name + role — hide on very small screens */}
          <div style={{ lineHeight: "1.3" }} className="hidden sm:block">
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
              {user?.name}
            </p>
            <span style={{
              fontSize: "11px", fontWeight: "500", padding: "1px 7px",
              borderRadius: "20px", textTransform: "capitalize",
              background: user?.role === "admin" ? "#ccfbf1" : "#d1fae5",
              color: user?.role === "admin" ? "#0f766e" : "#065f46",
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div style={{ width: "1px", height: "28px", background: "#e5e7eb", margin: "0 2px" }} className="hidden sm:block" />

        <button
          onClick={handleLogout}
          style={{
            background: "transparent", border: "1px solid #fca5a5",
            color: "#dc2626", fontSize: "13px", fontWeight: "500",
            padding: "6px 10px", borderRadius: "8px", cursor: "pointer",
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <HiArrowRightOnRectangle size={15} />
          {/* Hide text on very small screens */}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;