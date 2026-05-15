import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, updateUser } from "../services/api";
import toast from "react-hot-toast";
import {
  HiAcademicCap,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
  HiUserGroup,
  HiChartBar,
  HiCheckBadge,
} from "react-icons/hi2";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ email: "", name: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getAllUsers();
      const foundUser = res.data.find((u) => u.email === loginForm.email);
      if (!foundUser) { toast.error("Email not found."); return; }

      if (foundUser.role === "teacher" && foundUser.status === "blocked") {
        toast.error("Access not allowed. Your account has been blocked.");
        return;
      }

      if (foundUser.role === "teacher" && foundUser.password === "") {
        sessionStorage.setItem("pendingUser", JSON.stringify(foundUser));
        navigate("/setup-password");
        return;
      }
      if (foundUser.password !== loginForm.password) { toast.error("Incorrect password."); return; }
      login(foundUser);
      toast.success(`Welcome, ${foundUser.name}!`);
      navigate(foundUser.role === "admin" ? "/dashboard" : "/students");
    } catch {
      toast.error("Server error. Is JSON Server running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name.trim()) { toast.error("Username is required."); return; }
    if (regForm.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (regForm.password !== regForm.confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await getAllUsers();
      const existing = res.data.find((u) => u.email === regForm.email);
      if (!existing) { toast.error("This email hasn't been added by the admin. Contact your admin."); return; }
      if (existing.password && existing.password !== "") { toast.error("This email is already registered. Please log in instead."); return; }
      await updateUser(existing.id, { name: regForm.name, password: regForm.password });
      toast.success("Account created! You can now log in.");
      setLoginForm({ email: regForm.email, password: "" });
      setRegForm({ email: "", name: "", password: "", confirmPassword: "" });
      setTab("login");
    } catch {
      toast.error("Registration failed. Is JSON Server running?");
    } finally {
      setLoading(false);
    }
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
    >
      {show ? <HiEye size={18} /> : <HiEyeSlash size={18} />}
    </button>
  );

  return (
    /* On mobile: single column, scroll naturally top→bottom.
       On lg+: side-by-side split screen (original desktop layout). */
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col lg:flex-row">

      {/* ── Info Panel ──
          Mobile: full width banner at top, compact.
          Desktop: left half, tall, original design. */}
      <div className="w-full lg:w-[52%] bg-gradient-to-br from-teal-600 to-emerald-700 text-white relative overflow-hidden
                      px-6 py-10 lg:px-16 lg:py-12 flex flex-col justify-center">

        {/* Decorative circles — kept from original */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-10 -right-16 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 lg:mb-12">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HiAcademicCap size={24} className="text-white" />
            </div>
            <span className="text-2xl lg:text-3xl font-bold tracking-tight">Studly</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl lg:text-4xl font-bold leading-tight mb-3 lg:mb-4">
            Manage Students &<br />Teachers Effortlessly
          </h1>
          <p className="text-teal-100 text-sm lg:text-lg leading-relaxed mb-6 lg:mb-10 max-w-md">
            Studly is a modern student management portal — built for schools and institutions to
            track enrollments, manage teachers, and monitor progress all in one place.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-4">
            {[
              { icon: HiUserGroup, text: "Manage students and teacher accounts" },
              { icon: HiChartBar, text: "Live dashboard with key statistics" },
              { icon: HiLockClosed, text: "Role-based access control (Admin / Teacher)" },
              { icon: HiCheckBadge, text: "Track enrollment status and courses" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 lg:w-8 lg:h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-white" />
                </div>
                <p className="text-teal-100 text-xs lg:text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form Panel ──
          Mobile: full width below the info panel.
          Desktop: right half, centred. */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {tab === "login" ? "Sign in to Studly" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {tab === "login" ? "Enter your credentials to continue" : "Register as a teacher"}
            </p>
          </div>

          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@school.com"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <EyeToggle show={showLoginPw} onToggle={() => setShowLoginPw((v) => !v)} />
                </div>
                <p className="text-xs text-gray-400 mt-1">First-time teacher? Leave blank and press Sign In.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-gray-400 pt-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-teal-600 hover:underline font-medium cursor-pointer"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-lg flex items-start gap-2">
                <HiLockClosed size={14} className="flex-shrink-0 mt-0.5" />
                Only teachers added by the admin can register. Enter the email your admin used to add you.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="Email added by admin"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <p className="text-xs text-gray-400 mt-1">Must match the email your admin registered for you.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-gray-400 font-normal">(display name)</span>
                </label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showRegPw ? "text" : "password"}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <EyeToggle show={showRegPw} onToggle={() => setShowRegPw((v) => !v)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showRegConfirm ? "text" : "password"}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <EyeToggle show={showRegConfirm} onToggle={() => setShowRegConfirm((v) => !v)} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-400 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-teal-600 hover:underline font-medium cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;