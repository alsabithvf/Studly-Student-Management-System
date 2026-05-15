import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, getAllTeachers, getAllCourses } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  HiUsers,
  HiAcademicCap,
  HiBookOpen,
  HiUserPlus,
  HiCog6Tooth,
  HiChartBar,
} from "react-icons/hi2";

const StatCard = ({ label, value, colorClass, icon: Icon, iconColor }) => (
  <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${colorClass}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    <div className="mt-2">
      <Icon size={26} style={{ color: iconColor }} />
    </div>
  </div>
);

const ActionCard = ({ title, description, icon: Icon, iconColor, colorClass, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${colorClass} text-left w-full hover:shadow-md transition group cursor-pointer`}
  >
    <div className="mb-3">
      <Icon size={30} style={{ color: iconColor }} />
    </div>
    <p className="font-semibold text-gray-800 group-hover:text-teal-600 transition">{title}</p>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [blockedTeacherCount, setBlockedTeacherCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([getAllStudents(), getAllTeachers(), getAllCourses()])
      .then(([sRes, tRes, cRes]) => {
        setStudents(sRes.data);
        const teachers = tRes.data;
        setTeacherCount(teachers.length);
        setBlockedTeacherCount(teachers.filter((t) => t.status === "blocked").length);
        setCourseCount(cRes.data.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = students.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-8">

          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <HiChartBar size={20} className="text-teal-600" /> Overview
            </h2>
            {loading ? (
              <p className="text-gray-400">Loading stats...</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                  label="Total Students"
                  value={total}
                  colorClass="border-teal-500"
                  icon={HiUsers}
                  iconColor="#0d9488"
                />
                <StatCard
                  label="Total Teachers"
                  value={teacherCount}
                  colorClass="border-yellow-500"
                  icon={HiAcademicCap}
                  iconColor="#eab308"
                />
                <StatCard
                  label="Blocked Teachers"
                  value={blockedTeacherCount}
                  colorClass="border-red-500"
                  icon={HiAcademicCap}
                  iconColor="#ef4444"
                />
                <StatCard
                  label="Courses"
                  value={courseCount}
                  colorClass="border-emerald-500"
                  icon={HiBookOpen}
                  iconColor="#059669"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <HiCog6Tooth size={20} className="text-teal-600" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActionCard
                title="Manage Teachers"
                description="Add, block, or remove teacher accounts."
                icon={HiAcademicCap}
                iconColor="#0d9488"
                colorClass="border-teal-400"
                onClick={() => navigate("/manage-teachers")}
              />
              <ActionCard
                title="Manage Courses"
                description="Add or remove courses. They appear in student enrollment."
                icon={HiBookOpen}
                iconColor="#059669"
                colorClass="border-emerald-400"
                onClick={() => navigate("/add-course")}
              />
              <ActionCard
                title="Add Student"
                description="Enroll a new student into a course."
                icon={HiUserPlus}
                iconColor="#22c55e"
                colorClass="border-green-400"
                onClick={() => navigate("/add-student")}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;