import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, updateStudent, getAllCourses } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([getStudentById(id), getAllCourses()])
      .then(([studentRes, coursesRes]) => {
        setForm(studentRes.data);
        setCourses(coursesRes.data);
      })
      .catch(() => { toast.error("Failed to load data."); navigate("/students"); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) { setError("All fields are required."); return; }
    setSaving(true);
    try {
      await updateStudent(id, form);
      toast.success("Student updated successfully!");
      navigate("/students");
    } catch {
      setError("Failed to update. Check if JSON Server is running.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Loading student data...</p>;
  if (!form) return <p className="p-6 text-red-400">Student not found.</p>;

  const courseOptions = courses.map((c) => ({ value: c.name, label: c.name }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="max-w-xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6">✏️ Edit Student</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <CustomSelect
                    value={form.course}
                    onChange={(val) => setForm({ ...form, course: val })}
                    options={courseOptions}
                    placeholder="Select a course"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => navigate("/students")}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition cursor-pointer">
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

export default EditStudent;