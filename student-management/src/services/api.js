import axios from "axios";

const BASE_URL = "http://localhost:3000";

// Returns next sequential numeric string ID based on existing items
const getNextNumericId = (items) => {
  const maxId = items.reduce((max, item) => {
    const n = Number(item.id);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return String(maxId + 1);
};

export const getNextId = getNextNumericId;

// ── USERS / AUTH ──────────────────────────────────────────────────────────────
export const getAllUsers = () => axios.get(`${BASE_URL}/users`);
export const getUserById = (id) => axios.get(`${BASE_URL}/users/${id}`);

// Admin: add a teacher (empty password = must set on first login)
export const registerUser = async (userData) => {
  const res = await getAllUsers();
  const id = getNextNumericId(res.data);
  return axios.post(`${BASE_URL}/users`, { id, ...userData });
};

export const updateUser = (id, data) =>
  axios.patch(`${BASE_URL}/users/${id}`, data);

export const updatePassword = (userId, password) =>
  updateUser(userId, { password });

export const deleteUser = (id) => axios.delete(`${BASE_URL}/users/${id}`);

// ── TEACHERS ─────────────────────────────────────────────────────────────────
export const getAllTeachers = () =>
  axios.get(`${BASE_URL}/users?role=teacher`);

// ── STUDENTS ─────────────────────────────────────────────────────────────────
export const getAllStudents = () => axios.get(`${BASE_URL}/students`);
export const getStudentById = (id) => axios.get(`${BASE_URL}/students/${id}`);

export const addStudent = async (studentData) => {
  const res = await getAllStudents();
  const id = getNextNumericId(res.data);
  return axios.post(`${BASE_URL}/students`, { id, ...studentData });
};

export const updateStudent = (id, studentData) =>
  axios.put(`${BASE_URL}/students/${id}`, studentData);

export const deleteStudent = (id) =>
  axios.delete(`${BASE_URL}/students/${id}`);

export const toggleStudentStatus = (id, status) =>
  axios.patch(`${BASE_URL}/students/${id}`, { status });

// ── COURSES ───────────────────────────────────────────────────────────────────
export const getAllCourses = () => axios.get(`${BASE_URL}/courses`);

export const addCourse = async (courseData) => {
  const res = await getAllCourses();
  const id = getNextNumericId(res.data);
  return axios.post(`${BASE_URL}/courses`, { id, ...courseData });
};

export const deleteCourse = (id) => axios.delete(`${BASE_URL}/courses/${id}`);
// ── TEACHER STATUS ────────────────────────────────────────────────────────────
export const toggleTeacherStatus = (id, status) =>
  axios.patch(`${BASE_URL}/users/${id}`, { status });