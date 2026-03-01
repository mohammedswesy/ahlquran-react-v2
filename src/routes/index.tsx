// src/routes/index.tsx  (أو src/routes/AppRoutes.tsx)
import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute, RoleGuard } from "./guards"

// Auth
import Login from "@/pages/auth/Login"
import Unauthorized from "@/pages/auth/Unauthorized"

// Dashboards
import AdminDashboard from "@/pages/admin/Dashboard"
import TeacherDashboard from "@/pages/teacher/Dashboard"
import StudentDashboard from "@/pages/student/Dashboard"
import ParentDashboard from "@/pages/parent/Dashboard"
import EmployeeDashboard from "@/pages/employee/Dashboard"
import InstituteAdminDashboardPage from "@/pages/institute/InstituteAdminDashboardPage"

// Admin: Lists
import InstitutesList from "@/pages/admin/InstitutesList"
import EmployeesList from "@/pages/admin/EmployeesList"
import CirclesList from "@/pages/admin/CirclesList"
import CircleForm from "@/pages/admin/CircleForm"
import StudentsList from "@/pages/admin/StudentsList"
import ParentsList from "@/pages/admin/ParentsList"
import NotificationsList from "@/pages/admin/NotificationsList"
import TeachersList from "@/pages/admin/TeachersList"
import ParentCreate from "@/pages/admin/ParentCreate"
import ParentShow from "@/pages/admin/ParentShow"
import ParentEdit from "@/pages/admin/ParentEdit"
import EmployeeAttendancePage from "@/pages/admin/EmployeeAttendancePage"
import TeacherAttendancesList from "@/pages/admin/TeacherAttendancesList"
import AttendancesList from "@/pages/admin/AttendancesList"

// Teacher
import MyCircles from "@/pages/teacher/MyCircles"
import TakeAttendance from "@/pages/teacher/TakeAttendance"
import Assessments from "@/pages/teacher/Assessments"
import Memorization from "@/pages/teacher/Memorization"

// Student
import MyProgress from "@/pages/student/MyProgress"
import MySchedule from "@/pages/student/MySchedule"

// Parent
import Children from "@/pages/parent/Children"
import Reports from "@/pages/parent/Reports"

// Employee
import Tasks from "@/pages/employee/Tasks"
import People from "@/pages/employee/People"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        {/* =========================
            ADMIN (كل الأدمنز)
            ========================= */}
        <Route element={<RoleGuard allow={["super-admin", "org-admin", "institute-admin", "sub-admin"]} />}>
          {/* Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Attendance / Reports */}
          <Route path="/admin/teacher-attendance" element={<TeacherAttendancesList />} />
          <Route path="/admin/attendance" element={<AttendancesList />} />
          <Route path="/admin/employee-attendance" element={<EmployeeAttendancePage />} />

          {/* Circles CRUD */}
          <Route path="/admin/circles" element={<CirclesList />} />
          <Route path="/admin/circles/new" element={<CircleForm />} />
          <Route path="/admin/circles/:id" element={<CircleForm />} />

          {/* People Management */}
          <Route path="/admin/students" element={<StudentsList />} />

          <Route path="/admin/parents" element={<ParentsList />} />
          <Route path="/admin/parents/create" element={<ParentCreate />} />
          <Route path="/admin/parents/:id" element={<ParentShow />} />
          <Route path="/admin/parents/:id/edit" element={<ParentEdit />} />

          <Route path="/admin/teachers" element={<TeachersList />} />

          {/* System Notifications (ممكن تخليها للسوبر فقط لو بدك) */}
          <Route path="/admin/notifications" element={<NotificationsList />} />
        </Route>

        {/* =========================
            SUPER ADMIN ONLY
            ========================= */}
        <Route element={<RoleGuard allow={["super-admin"]} />}>
          <Route path="/admin/institutes" element={<InstitutesList />} />
          <Route path="/admin/employees" element={<EmployeesList />} />
        </Route>

        {/* =========================
            Institute Admin Dashboard
            ========================= */}
        <Route element={<RoleGuard allow={["institute-admin", "sub-admin"]} />}>
          <Route path="/institute/dashboard" element={<InstituteAdminDashboardPage />} />
        </Route>

        {/* =========================
            Teacher
            ========================= */}
        <Route element={<RoleGuard allow={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/circles" element={<MyCircles />} />
          <Route path="/teacher/attendance" element={<TakeAttendance />} />
          <Route path="/teacher/assessments" element={<Assessments />} />
          <Route path="/teacher/memorization" element={<Memorization />} />
        </Route>

        {/* =========================
            Student
            ========================= */}
        <Route element={<RoleGuard allow={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/progress" element={<MyProgress />} />
          <Route path="/student/schedule" element={<MySchedule />} />
        </Route>

        {/* =========================
            Parent
            ========================= */}
        <Route element={<RoleGuard allow={["parent"]} />}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/children" element={<Children />} />
          <Route path="/parent/reports" element={<Reports />} />
        </Route>

        {/* =========================
            Employee
            ========================= */}
        <Route element={<RoleGuard allow={["employee"]} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<Tasks />} />
          <Route path="/employee/people" element={<People />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
