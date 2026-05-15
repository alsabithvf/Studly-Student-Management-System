import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

const StudentTable = ({ students, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (students.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="text-lg font-medium">No students found</p>
        <p className="text-sm">Try changing your search or filter</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table (md and above) ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-400 font-mono">{student.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                <td className="px-4 py-3 text-gray-600">{student.email}</td>
                <td className="px-4 py-3 text-gray-600">{student.phone}</td>
                <td className="px-4 py-3">
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                    {student.course}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-student/${student.id}`)}
                      className="flex items-center gap-1 text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      <HiPencilSquare size={13} /> Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(student.id)}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg transition cursor-pointer"
                      >
                        <HiTrash size={13} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (below md) ── */}
      <div className="md:hidden space-y-3">
        {students.map((student) => (
          <div key={student.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            {/* Top row: name + course badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{student.name}</p>
                <p className="text-xs text-gray-400 font-mono">ID: {student.id}</p>
              </div>
              <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap shrink-0">
                {student.course}
              </span>
            </div>

            {/* Detail rows — email and phone always visible */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 w-12 shrink-0">Email</span>
                <span className="text-xs text-gray-600 break-all">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 w-12 shrink-0">Phone</span>
                <span className="text-xs text-gray-600">{student.phone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => navigate(`/edit-student/${student.id}`)}
                className="flex-1 flex items-center justify-center gap-1 text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <HiPencilSquare size={13} /> Edit
              </button>
              {isAdmin && (
                <button
                  onClick={() => onDelete(student.id)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <HiTrash size={13} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentTable;