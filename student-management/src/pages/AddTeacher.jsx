import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, registerUser } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await getAllUsers();
      const exists = res.data.find((u) => u.email === form.email);
      if (exists) {
        toast.error("This email is already registered.");
        return;
      }

      await registerUser({
        name: form.name,
        email: form.email,
        password: "",
        role: "teacher",
      });

      toast.success(`Teacher "${form.name}" added! They can set their password on first login.`);
      navigate("/dashboard");
    } catch {
      toast.error("Failed to add teacher. Is JSON Server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              👩‍🏫 Add New Teacher
            </h2>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="bg-teal-50 border border-teal-100 text-teal-700 text-xs px-4 py-3 rounded-lg mb-5">
                💡 The teacher will be added with no password. On their first login, they will be prompted to set their own password.
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-gray-400 font-normal">(display name)</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="teacher@gmail.com"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Adding..." : "Add Teacher"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTeacher;