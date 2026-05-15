import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateAuthUser } = useAuth();

  const [nameForm, setNameForm] = useState({ name: user?.name || "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) { toast.error("Name cannot be empty."); return; }
    setSavingName(true);
    try {
      await updateUser(user.id, { name: nameForm.name.trim() });
      updateAuthUser({ name: nameForm.name.trim() });
      toast.success("Name updated successfully!");
    } catch {
      toast.error("Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.current !== user.password) { toast.error("Current password is incorrect."); return; }
    if (pwForm.newPw.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error("Passwords do not match."); return; }
    setSavingPw(true);
    try {
      await updateUser(user.id, { password: pwForm.newPw });
      updateAuthUser({ password: pwForm.newPw });
      setPwForm({ current: "", newPw: "", confirm: "" });
      toast.success("Password changed successfully!");
    } catch {
      toast.error("Failed to change password.");
    } finally {
      setSavingPw(false);
    }
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">👤 My Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">

            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Account Info</h3>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: user?.role === "admin" ? "#ccfbf1" : "#d1fae5",
                      color: user?.role === "admin" ? "#0f766e" : "#065f46",
                    }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 flex items-center gap-2">
                  <span className="truncate">{user?.email}</span>
                  <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded shrink-0">Read-only</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Email is managed by admin and cannot be changed.</p>
              </div>

              <form onSubmit={handleNameSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
                  <input
                    value={nameForm.name}
                    onChange={(e) => setNameForm({ name: e.target.value })}
                    placeholder="Your display name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <button type="submit" disabled={savingName}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-60 cursor-pointer">
                  {savingName ? "Saving..." : "Update Name"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-4">🔐 Change Password</h3>
              <form onSubmit={handlePasswordSave} className="space-y-3">

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={pwForm.current}
                      onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                      placeholder="Enter current password"
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showCurrent ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={pwForm.newPw}
                      onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showNew ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                      placeholder="Re-enter new password"
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={savingPw}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-60 cursor-pointer">
                  {savingPw ? "Saving..." : "Change Password"}
                </button>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;