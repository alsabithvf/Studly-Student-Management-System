import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, addCourse, deleteCourse } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const AddCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setFetching(true);
    getAllCourses()
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Failed to load courses."))
      .finally(() => setFetching(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const trimmed = courseName.trim();
    if (!trimmed) {
      toast.error("Course name cannot be empty.");
      return;
    }

    const exists = courses.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      toast.error("This course already exists.");
      return;
    }

    setLoading(true);
    try {
      await addCourse({ name: trimmed });
      toast.success(`Course "${trimmed}" added!`);
      setCourseName("");
      fetchCourses();
    } catch {
      toast.error("Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (course) => {
    if (!window.confirm(`Delete course "${course.name}"?`)) return;

    toast.promise(
      deleteCourse(course.id).then(() => fetchCourses()),
      {
        loading: "Deleting...",
        success: `Course "${course.name}" deleted.`,
        error: "Failed to delete.",
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📚 Manage Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">

            {/* Add Course Form */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Add New Course</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Machine Learning"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Adding..." : "➕ Add Course"}
                </button>
              </form>
            </div>

            {/* Existing Courses List */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Existing Courses ({courses.length})
              </h3>

              {fetching ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : courses.length === 0 ? (
                <p className="text-gray-400 text-sm">No courses yet. Add one!</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg gap-2"
                    >
                      <span className="text-sm text-gray-700 font-medium truncate">
                        📖 {course.name}
                      </span>
                      <button
                        onClick={() => handleDelete(course)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition cursor-pointer shrink-0"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;