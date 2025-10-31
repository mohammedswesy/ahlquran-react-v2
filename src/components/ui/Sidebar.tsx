// src/components/ui/Sidebar.tsx  أو  src/layouts/Sidebar.tsx (حسب مكانه عندك)
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/store/auth" // ✅ هذا هو الهوك الصحيح
import {
  LayoutDashboard, Users, School, BookOpen, Bell, LibraryBig, IdCard, Settings,
} from "lucide-react"

type Role =
  | "super-admin" | "org-admin" | "institute-admin" | "sub-admin"
  | "teacher" | "student" | "parent" | "employee"

type NavItem = {
  label: string
  to: string
  icon: React.ElementType
  roles: Role[]
}

const NAV: NavItem[] = [
  // ===== Admin =====
  { label: "لوحة القيادة", to: "/admin", icon: LayoutDashboard, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "المعاهد", to: "/admin/institutes", icon: LibraryBig, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "الموظفون", to: "/admin/employees", icon: IdCard, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "الحلقات", to: "/admin/circles", icon: BookOpen, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "الطلبة", to: "/admin/students", icon: Users, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "أولياء الأمور", to: "/admin/parents", icon: Users, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "الإشعارات", to: "/admin/notifications", icon: Bell, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },
  { label: "المعلمين", to: "/admin/teachers", icon: School, roles: ["super-admin", "org-admin", "institute-admin", "sub-admin"] },

  // ===== Teacher =====
  { label: "لوحة المعلم", to: "/teacher", icon: LayoutDashboard, roles: ["teacher"] },
  { label: "حلقاتي", to: "/teacher/circles", icon: BookOpen, roles: ["teacher"] },
  { label: "تسجيل الحضور", to: "/teacher/attendance", icon: BookOpen, roles: ["teacher"] },
  { label: "التقييمات", to: "/teacher/assessments", icon: BookOpen, roles: ["teacher"] },

  // ===== Student =====
  { label: "لوحة الطالب", to: "/student", icon: LayoutDashboard, roles: ["student"] },
  { label: "تقدّمي", to: "/student/progress", icon: BookOpen, roles: ["student"] },
  { label: "جدولي", to: "/student/schedule", icon: BookOpen, roles: ["student"] },

  // ===== Parent =====
  { label: "لوحة وليّ الأمر", to: "/parent", icon: LayoutDashboard, roles: ["parent"] },
  { label: "أبنائي", to: "/parent/children", icon: Users, roles: ["parent"] },
  { label: "التقارير", to: "/parent/reports", icon: BookOpen, roles: ["parent"] },

  // ===== Employee =====
  { label: "لوحة الموظف", to: "/employee", icon: LayoutDashboard, roles: ["employee"] },
  { label: "المهام", to: "/employee/tasks", icon: BookOpen, roles: ["employee"] },
  { label: "الأشخاص", to: "/employee/people", icon: Users, roles: ["employee"] },

  // (مكان للإعدادات لاحقًا)
  // { label: "الإعدادات", to: "/settings", icon: Settings, roles: ["super-admin","org-admin","institute-admin","sub-admin","teacher","student","parent","employee"] },
]

export default function Sidebar() {
  // ✅ الدور مباشرة من الستور
  const role = useAuth((s) => s.role as Role | null)
  const { pathname } = useLocation()

  const visible = role ? NAV.filter((i) => i.roles.includes(role)) : []

  return (
    <aside className="w-64 shrink-0 border-l bg-white p-3" dir="rtl">
      <div className="text-xs text-gray-500 mb-2">القائمة</div>
      <nav className="space-y-1">
        {visible.map((item) => {
          const Icon = item.icon
          // ✅ اعتبره Active لو المسار يبدأ بالرابط (يحسّن لما تدخل على صفحات فرعية)
          const active = pathname === item.to || pathname.startsWith(item.to + "/")
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50",
                active && "bg-gray-100 font-semibold"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
        {!role && (
          <div className="text-xs text-gray-400 px-3 py-2">
            سجّل الدخول لعرض القائمة
          </div>
        )}
      </nav>
    </aside>
  )
}
