import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent, getAllCourses } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";

const AddStudent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "" });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getAllCourses()
      .then((res) => {
        const data = res.data;
        setCourses(data);
        if (data.length > 0) setForm((prev) => ({ ...prev, course: "" }));
      })
      .catch(() => toast.error("Could not load courses."))
      .finally(() => setCoursesLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.course) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await addStudent(form);
      toast.success("Student added successfully!");
      navigate("/students");
    } catch {
      toast.error("Failed to add student. Is JSON Server running?");
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = courses.map((c) => ({ value: c.name, label: c.name }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="max-w-xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6">➕ Add New Student</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Alice Johnson" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alice@student.com" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                    {coursesLoading && <span className="text-xs text-gray-400 ml-2">Loading...</span>}
                  </label>
                  <CustomSelect
                    value={form.course}
                    onChange={(val) => setForm({ ...form, course: val })}
                    options={courseOptions}
                    disabled={coursesLoading || courses.length === 0}
                    placeholder="Select a course"
                  />
                  {courses.length === 0 && !coursesLoading && (
                    <p className="text-xs text-orange-500 mt-1">⚠️ Go to Dashboard → Manage Courses to add courses first.</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" disabled={loading || coursesLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer">
                    {loading ? "Adding..." : "Add Student"}
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

export default AddStudent;