// // src/layouts/AppLayout.tsx
// import { ReactNode } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import clsx from 'clsx'
// import { useAuth } from '@/store/auth'

// export default function AppLayout({ children }: { children: ReactNode }) {
//   const { logout, role } = useAuth()
//   const loc = useLocation()

//   // قائمة مخصّصة لكل دور — هتظهر فقط روابط الدور الحالي
//   const nav = [
//     // ===== Admin =====
//     { to: '/admin', label: 'Dashboard', roles: ['super-admin', 'org-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/institutes', label: 'المعاهد', roles: ['super-admin', 'org-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/employees', label: 'الموظفين ', roles: ['super-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/circles', label: 'الحلقات', roles: ['super-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/students', label: 'الطلاب', roles: ['super-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/parents', label: 'اولياء الامور', roles: ['super-admin', 'institute-admin', 'sub-admin'] },
//     { to: '/admin/notifications', label: 'Notifications', roles: ['super-admin', 'institute-admin', 'sub-admin'] },

//     // ===== Teacher =====
//     { to: '/teacher', label: 'Dashboard', roles: ['teacher'] },
//     { to: '/teacher/circles', label: 'My Circles', roles: ['teacher'] },
//     { to: '/teacher/attendance', label: 'Attendance', roles: ['teacher'] },
//     { to: '/teacher/assessments', label: 'Assessments', roles: ['teacher'] },

//     // ===== Student =====
//     { to: '/student', label: 'Dashboard', roles: ['student'] },
//     { to: '/student/progress', label: 'My Progress', roles: ['student'] },
//     { to: '/student/schedule', label: 'My Schedule', roles: ['student'] },

//     // ===== Parent =====
//     { to: '/parent', label: 'Dashboard', roles: ['parent'] },
//     { to: '/parent/children', label: 'My Children', roles: ['parent'] },
//     { to: '/parent/reports', label: 'Reports & Certificates', roles: ['parent'] },

//     // ===== Employee =====
//     { to: '/employee', label: 'Dashboard', roles: ['employee'] },
//     { to: '/employee/tasks', label: 'Tasks', roles: ['employee'] },
//     { to: '/employee/people', label: 'People Directory', roles: ['employee'] },
//   ]

//   return (
//     <div className="min-h-screen grid grid-cols-[260px_1fr] bg-gray-100">
//       {/* Sidebar */}
//       <aside className="bg-white border-r flex flex-col">
//         <div className="p-4 font-bold text-xl">Ahl Quran</div>

//         <nav className="px-2 space-y-1 flex-1">
//           {nav
//             .filter(n => !n.roles || n.roles.includes(String(role)))
//             .map(n => (
//               <Link
//                 key={n.to}
//                 to={n.to}
//                 className={clsx(
//                   'block px-3 py-2 rounded hover:bg-gray-100',
//                   loc.pathname.startsWith(n.to) && 'bg-gray-100 font-semibold'
//                 )}
//               >
//                 {n.label}
//               </Link>
//             ))}
//         </nav>

//         <div className="p-4">
//           <button
//             onClick={logout}
//             className="w-full bg-red-500 text-white rounded px-3 py-2"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Content */}
//       <main className="p-6">
//         <div className="mx-auto max-w-7xl">{children}</div>
//       </main>
//     </div>
//   )
// }

// src/layouts/AppLayout.tsx
import { ReactNode, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Breadcrumbs from '@/components/Breadcrumbs'
import clsx from 'clsx'
import { useAuth } from '@/store/auth'
import {
  FaArrowRightFromBracket,
  FaHouse,
  FaEnvelope,
  FaGear,
  FaUsers,
  FaUserGroup,
  FaIdBadge,
  FaBook,
  FaCalendarCheck,
  FaClipboardList,
} from 'react-icons/fa6'
import { FaChalkboardTeacher, FaChartBar } from 'react-icons/fa'

type Item = { to: string; label: string; icon: JSX.Element }
type Section = { title?: string; items: Item[] }

const ADMIN_ROLES = ['super-admin', 'org-admin', 'institute-admin', 'sub-admin'] as const

export default function AppLayout({ children }: { children: ReactNode }) {
  const { logout, role } = useAuth()
  const loc = useLocation()
  const r = String(role || '')

  const user = {
    name: 'الشيخ محمد',
    roleLabel:
      ADMIN_ROLES.includes(r as any) ? 'المشرف العام'
        : r === 'teacher' ? 'معلّم'
          : r === 'student' ? 'طالب'
            : r === 'parent' ? 'وليّ أمر'
              : r === 'employee' ? 'موظّف'
                : 'مستخدم',
    online: true,
  }

  const sections: Section[] = useMemo(() => {
    if (ADMIN_ROLES.includes(r as any)) {
      return [
        {
          items: [
            { to: '/admin', label: 'لوحة القيادة', icon: <FaHouse /> },
            { to: '#', label: 'الرسائل', icon: <FaEnvelope /> },
            { to: '#', label: 'الإعدادات', icon: <FaGear /> },
          ],
        },
        {
          title: 'الشؤون الإدارية',
          items: [
            { to: '/admin/students', label: 'الطلاب', icon: <FaUsers /> },
            { to: '/admin/employees', label: 'المعلمين', icon: <FaChalkboardTeacher /> },
            { to: '/admin/parents', label: 'أولياء الأمور', icon: <FaUserGroup /> },
            { to: '/admin/circles', label: 'الحلقات', icon: <FaBook /> },
            { to: '/admin/notifications', label: 'الإشعارات', icon: <FaClipboardList /> },
          ],
        },
      ]
    }

    if (r === 'teacher') {
      return [
        {
          items: [
            { to: '/teacher', label: 'لوحة القيادة', icon: <FaHouse /> },
            { to: '/teacher/circles', label: 'حلقاتي', icon: <FaBook /> },
            { to: '/teacher/attendance', label: 'الحضور والغياب', icon: <FaCalendarCheck /> },
            { to: '/teacher/assessments', label: 'الاختبارات', icon: <FaClipboardList /> },
          ],
        },
      ]
    }

    if (r === 'student') {
      return [
        {
          items: [
            { to: '/student', label: 'لوحة القيادة', icon: <FaHouse /> },
            { to: '/student/progress', label: 'تقدّمي', icon: <FaChartBar /> },
            { to: '/student/schedule', label: 'جدولي', icon: <FaCalendarCheck /> },
          ],
        },
      ]
    }

    if (r === 'parent') {
      return [
        {
          items: [
            { to: '/parent', label: 'لوحة القيادة', icon: <FaHouse /> },
            { to: '/parent/children', label: 'أبنائي', icon: <FaUsers /> },
            { to: '/parent/reports', label: 'التقارير والشهادات', icon: <FaIdBadge /> },
          ],
        },
      ]
    }

    if (r === 'employee') {
      return [
        {
          items: [
            { to: '/employee', label: 'لوحة القيادة', icon: <FaHouse /> },
            { to: '/employee/tasks', label: 'المهام', icon: <FaClipboardList /> },
            { to: '/employee/people', label: 'دليل الأشخاص', icon: <FaUsers /> },
          ],
        },
      ]
    }

    return [{ items: [{ to: '/', label: 'الرئيسية', icon: <FaHouse /> }] }]
  }, [r])

  const isActive = (to: string) =>
    to !== '#' && (loc.pathname === to || loc.pathname.startsWith(to))

  const gold = '#b48c43'
  const teal = '#0f5f5c'

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      {/* شريط علوي */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[13px] hover:bg-gray-50"
          >
            <FaArrowRightFromBracket />
            <span>تسجيل الخروج</span>
          </button>
          <div className="text-sm" style={{ color: teal }} />
        </div>
      </div>

      {/* المحتوى + الشريط الجانبي */}
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6">
        {/* المحتوى (يسار) */}
        <main className="col-span-12 lg:col-span-9 order-2 lg:order-1">
          <div className="rounded-2xl border bg-white shadow-sm p-5">
            <Breadcrumbs />
            {children}
          </div>
        </main>

        {/* الشريط الجانبي (يمين) */}
        <aside className="col-span-12 lg:col-span-3 order-1 lg:order-2">
          <div className="rounded-2xl border bg-white shadow-sm p-4">
            {/* بطاقة المستخدم */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: teal }}>
                <span className="font-bold">ع</span>
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.roleLabel}</div>
              </div>
              {user.online && (
                <span
                  className="ms-auto text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${teal}22`, color: teal }}
                >
                  متصل
                </span>
              )}
            </div>

            {/* القوائم */}
            <nav className="mt-4 space-y-5">
              {sections.map((sec, idx) => (
                <div key={idx}>
                  {sec.title && (
                    <div className="mb-2 px-2 text-sm font-semibold" style={{ color: gold }}>
                      {sec.title}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {sec.items.map((it) => (
                      <li key={it.to}>
                        <Link
                          to={it.to}
                          className={clsx(
                            'flex items-center gap-2 rounded-xl px-3 py-2 text-[15px]',
                            isActive(it.to) ? 'bg-[#b48c43]/10 font-semibold text-[#0f5f5c]' : 'hover:bg-gray-50'
                          )}
                        >
                          <span
                            className="text-base"
                            style={{ color: isActive(it.to) ? '#b48c43' : '#455a64' }}
                          >
                            {it.icon}
                          </span>
                          <span>{it.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}



