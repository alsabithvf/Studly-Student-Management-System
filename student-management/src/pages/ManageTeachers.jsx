import { useEffect, useState } from "react";
import { getAllTeachers, registerUser, getAllUsers, deleteUser, updateUser } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import {
  HiAcademicCap,
  HiPlus,
  HiXMark,
  HiCheckCircle,
  HiClock,
  HiNoSymbol,
  HiTrash,
  HiLockClosed,
  HiLockOpen,
} from "react-icons/hi2";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    getAllTeachers()
      .then((res) => setTeachers(res.data))
      .catch(() => toast.error("Failed to load teachers."))
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.email.trim()) { toast.error("Email is required."); return; }

    setAdding(true);
    try {
      const res = await getAllUsers();
      const exists = res.data.find((u) => u.email === addForm.email);
      if (exists) { toast.error("This email is already registered."); return; }

      await registerUser({
        name: addForm.name.trim() || "Teacher",
        email: addForm.email.trim(),
        password: "",
        role: "teacher",
        status: "active",
      });

      toast.success(`Teacher slot added for ${addForm.email}. They can now register.`);
      setAddForm({ name: "", email: "" });
      setShowAddForm(false);
      fetchTeachers();
    } catch {
      toast.error("Failed to add teacher.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (teacher) => {
    if (!window.confirm(`Remove teacher "${teacher.name}" (${teacher.email})? They will lose access.`)) return;
    toast.promise(
      deleteUser(teacher.id).then(() => fetchTeachers()),
      { loading: "Removing...", success: "Teacher removed.", error: "Failed to remove." }
    );
  };

  const handleToggleBlock = (teacher) => {
    const isBlocked = teacher.status === "blocked";
    const newStatus = isBlocked ? "active" : "blocked";
    const action = isBlocked ? "unblocked" : "blocked";
    toast.promise(
      updateUser(teacher.id, { status: newStatus }).then(() => fetchTeachers()),
      {
        loading: "Updating...",
        success: `Teacher ${action}.`,
        error: "Failed to update status.",
      }
    );
  };

  const registered = teachers.filter((t) => t.password && t.password !== "");
  const pending = teachers.filter((t) => !t.password || t.password === "");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <HiAcademicCap size={22} className="text-teal-600 shrink-0" /> Manage Teachers
            </h2>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition cursor-pointer shrink-0"
            >
              {showAddForm ? <><HiXMark size={16} /> Cancel</> : <><HiPlus size={16} /> Add Teacher</>}
            </button>
          </div>

          {/* Add Teacher Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 max-w-md w-full">
              <h3 className="font-semibold text-gray-700 mb-1">Add Teacher Email</h3>
              <p className="text-xs text-gray-400 mb-4">
                Once added, the teacher can register using this email on the login page.
              </p>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Display Name (optional)</label>
                  <input
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. John Smith (can be changed by teacher)"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="teacher@gmail.com"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60 text-sm cursor-pointer"
                >
                  {adding ? "Adding..." : "Add Teacher"}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">

            {/* Registered Teachers */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <HiCheckCircle size={18} className="text-green-500" />
                Registered
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{registered.length}</span>
              </h3>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : registered.length === 0 ? (
                <p className="text-gray-400 text-sm">No registered teachers yet.</p>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {registered.map((t) => (
                    <li key={t.id} className={`flex items-start sm:items-center justify-between gap-2 px-3 py-2.5 rounded-lg ${t.status === "blocked" ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
                          {t.name}
                          {t.status === "blocked" && (
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <HiNoSymbol size={10} /> Blocked
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{t.email}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleBlock(t)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition cursor-pointer ${
                            t.status === "blocked"
                              ? "text-green-600 hover:bg-green-50"
                              : "text-yellow-700 hover:bg-yellow-50"
                          }`}
                          title={t.status === "blocked" ? "Unblock teacher" : "Block teacher"}
                        >
                          {t.status === "blocked" ? <><HiLockOpen size={13} /> Unblock</> : <><HiLockClosed size={13} /> Block</>}
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition cursor-pointer"
                        >
                          <HiTrash size={13} /> Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pending Teachers */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <HiClock size={18} className="text-amber-500" />
                Pending Registration
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pending.length}</span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Emails added by you — teacher hasn't registered yet.
              </p>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : pending.length === 0 ? (
                <p className="text-gray-400 text-sm">No pending invitations.</p>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {pending.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-100 px-3 py-2.5 rounded-lg">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{t.email}</p>
                        <p className="text-xs text-amber-600">Awaiting registration</p>
                      </div>
                      <button
                        onClick={() => handleDelete(t)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition cursor-pointer shrink-0"
                      >
                        <HiXMark size={13} /> Revoke
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageTeachers;