import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, RoleGuard } from './guards'

import Login from '@/pages/auth/Login'
import Unauthorized from '@/pages/auth/Unauthorized'

import AdminDashboard from '@/pages/admin/Dashboard'
import TeacherDashboard from '@/pages/teacher/Dashboard'
import StudentDashboard from '@/pages/student/Dashboard'
import ParentDashboard from '@/pages/parent/Dashboard'
import EmployeeDashboard from '@/pages/employee/Dashboard'

import InstitutesList from '@/pages/admin/InstitutesList'
import InstituteForm from '@/pages/admin/InstituteForm'
import EmployeesList from '@/pages/admin/EmployeesList'
import EmployeeForm from '@/pages/admin/EmployeeForm'
import CirclesList from '@/pages/admin/CirclesList'
import CircleForm from '@/pages/admin/CircleForm'
import StudentsList from '@/pages/admin/StudentsList'
import ParentsList from '@/pages/admin/ParentsList'
import NotificationsList from '@/pages/admin/NotificationsList'

import MyCircles from '@/pages/teacher/MyCircles'
import TakeAttendance from '@/pages/teacher/TakeAttendance'
import Assessments from '@/pages/teacher/Assessments'

import MyProgress from '@/pages/student/MyProgress'
import MySchedule from '@/pages/student/MySchedule'

import Children from '@/pages/parent/Children'
import Reports from '@/pages/parent/Reports'

import Tasks from '@/pages/employee/Tasks'
import People from '@/pages/employee/People'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        {/* Admin group */}
        <Route element={<RoleGuard allow={['super-admin', 'org-admin', 'institute-admin', 'sub-admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/institutes" element={<InstitutesList />} />
          <Route path="/admin/institutes/new" element={<InstituteForm />} />
          <Route path="/admin/institutes/:id" element={<InstituteForm />} />

          <Route path="/admin/employees" element={<EmployeesList />} />
          <Route path="/admin/employees/new" element={<EmployeeForm />} />
          <Route path="/admin/employees/:id" element={<EmployeeForm />} />

          <Route path="/admin/circles" element={<CirclesList />} />
          <Route path="/admin/circles/new" element={<CircleForm />} />
          <Route path="/admin/circles/:id" element={<CircleForm />} />

          <Route path="/admin/students" element={<StudentsList />} />
          <Route path="/admin/parents" element={<ParentsList />} />
          <Route path="/admin/notifications" element={<NotificationsList />} />
        </Route>

        {/* Teacher group */}
        <Route element={<RoleGuard allow={['teacher']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/circles" element={<MyCircles />} />
          <Route path="/teacher/attendance" element={<TakeAttendance />} />
          <Route path="/teacher/assessments" element={<Assessments />} />
        </Route>

        {/* Student group */}
        <Route element={<RoleGuard allow={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/progress" element={<MyProgress />} />
          <Route path="/student/schedule" element={<MySchedule />} />
        </Route>

        {/* Parent group */}
        <Route element={<RoleGuard allow={['parent']} />}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/children" element={<Children />} />
          <Route path="/parent/reports" element={<Reports />} />
        </Route>

        {/* Employee group */}
        <Route element={<RoleGuard allow={['employee']} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<Tasks />} />
          <Route path="/employee/people" element={<People />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
