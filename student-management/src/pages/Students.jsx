import { useEffect, useState, useRef } from "react";
import { getAllStudents, deleteStudent, getAllCourses } from "../services/api";
import StudentTable from "../components/StudentTable";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";
import { HiMagnifyingGlass, HiAdjustmentsHorizontal, HiXMark, HiUserPlus } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const STUDENTS_PER_PAGE = 5;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
    getAllCourses().then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    getAllStudents()
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => Number(a.id) - Number(b.id));
        setStudents(sorted);
      })
      .catch(() => toast.error("Failed to load students."))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    toast.promise(
      deleteStudent(id).then(() => fetchStudents()),
      { loading: "Deleting...", success: "Student deleted.", error: "Failed to delete." }
    );
  };

  const handleSearchChange = (e) => { setSearch(e.target.value); setCurrentPage(1); };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || String(s.id).includes(q);
    const matchesCourse = courseFilter === "All" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.ceil(filtered.length / STUDENTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginated = filtered.slice((safePage - 1) * STUDENTS_PER_PAGE, safePage * STUDENTS_PER_PAGE);

  const resetFilters = () => { setCourseFilter("All"); setCurrentPage(1); };
  const activeFilterCount = [courseFilter !== "All"].filter(Boolean).length;

  const courseOptions = [
    { value: "All", label: "All Courses" },
    ...courses.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Students
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</span>
              <button
                onClick={() => navigate("/add-student")}
                className="flex items-center gap-1 sm:gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition cursor-pointer"
              >
                <HiUserPlus size={16} />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[150px]">
              <HiMagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name or email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 border rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition cursor-pointer
                  ${activeFilterCount > 0 ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <HiAdjustmentsHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                )}
                <span className="text-xs">{filterOpen ? "▲" : "▼"}</span>
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 min-w-[220px]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filter Options</p>

                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                    <CustomSelect
                      value={courseFilter}
                      onChange={(val) => { setCourseFilter(val); setCurrentPage(1); }}
                      options={courseOptions}
                    />
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { resetFilters(); setFilterOpen(false); }}
                      className="w-full text-sm text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg py-1.5 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <HiXMark size={14} /> Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {courseFilter !== "All" && (
                <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {courseFilter}
                  <button onClick={() => { setCourseFilter("All"); setCurrentPage(1); }} className="ml-1 hover:text-teal-900 cursor-pointer">
                    <HiXMark size={12} />
                  </button>
                </span>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
            {loading ? (
              <p className="text-center text-gray-400 py-8">Loading students...</p>
            ) : (
              <>
                <StudentTable students={paginated} onDelete={handleDelete} />
                <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Students;