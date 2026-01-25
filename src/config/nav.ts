import type { IconType } from "react-icons"
import {
    PiSquaresFourBold,
    PiBuildingsBold,
    PiBookOpenTextBold,
    PiUsersThreeBold,
    PiBellBold,
    PiChalkboardTeacherBold,
    PiChartLineBold,
    PiClipboardTextBold,
    PiGearBold,
    PiBooksBold,
} from "react-icons/pi"

export type Role =
    | "super-admin" | "org-admin" | "institute-admin" | "sub-admin"
    | "teacher" | "student" | "parent" | "employee"

export type NavItem = {
    key: string
    label: string
    to: string
    icon: IconType
    roles: Role[]
    badgeKey?: string // اختياري: لعداد صغير
}

export type NavSection = {
    key: string
    label: string
    roles: Role[]
    items: NavItem[]
}

const ADMIN_ROLES: Role[] = ["super-admin", "org-admin", "institute-admin", "sub-admin"]

export const NAV_SECTIONS: NavSection[] = [
    {
        key: "dashboards",
        label: "لوحات",
        roles: ["super-admin", "org-admin", "institute-admin", "sub-admin", "teacher", "student", "parent", "employee"],
        items: [
            { key: "admin_dash", label: "لوحة القيادة", to: "/admin", icon: PiSquaresFourBold, roles: ADMIN_ROLES },
            { key: "inst_dash", label: "لوحة مدير المعهد", to: "/institute/dashboard", icon: PiSquaresFourBold, roles: ["institute-admin", "sub-admin"] },

            { key: "teacher_dash", label: "لوحة المعلم", to: "/teacher", icon: PiSquaresFourBold, roles: ["teacher"] },
            { key: "student_dash", label: "لوحة الطالب", to: "/student", icon: PiSquaresFourBold, roles: ["student"] },
            { key: "parent_dash", label: "لوحة ولي الأمر", to: "/parent", icon: PiSquaresFourBold, roles: ["parent"] },
            { key: "employee_dash", label: "لوحة الموظف", to: "/employee", icon: PiSquaresFourBold, roles: ["employee"] },
        ],
    },

    {
        key: "management",
        label: "إدارة",
        roles: ADMIN_ROLES,
        items: [
            { key: "institutes", label: "المعاهد", to: "/admin/institutes", icon: PiBuildingsBold, roles: ADMIN_ROLES },
            { key: "employees", label: "الموظفون", to: "/admin/employees", icon: PiChalkboardTeacherBold, roles: ADMIN_ROLES },
            { key: "circles", label: "الحلقات", to: "/admin/circles", icon: PiBookOpenTextBold, roles: ADMIN_ROLES },
            { key: "students", label: "الطلبة", to: "/admin/students", icon: PiUsersThreeBold, roles: ADMIN_ROLES },
            { key: "parents", label: "أولياء الأمور", to: "/admin/parents", icon: PiUsersThreeBold, roles: ADMIN_ROLES },
            { key: "teachers", label: "المعلمون", to: "/admin/teachers", icon: PiUsersThreeBold, roles: ADMIN_ROLES },
        ],
    },

    {
        key: "operations",
        label: "تشغيل",
        roles: ["teacher", "student", "parent", ...ADMIN_ROLES],
        items: [
            { key: "attendance", label: "الحضور والغياب", to: "/teacher/attendance", icon: PiClipboardTextBold, roles: ["teacher"] },
            { key: "my_circles", label: "حلقاتي", to: "/teacher/circles", icon: PiBookOpenTextBold, roles: ["teacher"] },

            { key: "student_schedule", label: "جدولي", to: "/student/schedule", icon: PiBookOpenTextBold, roles: ["student"] },

            { key: "parent_children", label: "أبنائي", to: "/parent/children", icon: PiUsersThreeBold, roles: ["parent"] },
            { key: "parent_reports", label: "التقارير", to: "/parent/reports", icon: PiChartLineBold, roles: ["parent"] },
        ],
    },

    {
        key: "system",
        label: "النظام",
        roles: ["teacher", "student", "parent", "employee", ...ADMIN_ROLES],
        items: [
            { key: "notifications", label: "الإشعارات", to: "/admin/notifications", icon: PiBellBold, roles: ADMIN_ROLES, badgeKey: "notifications" },
            { key: "library", label: "المكتبة", to: "/library", icon: PiBooksBold, roles: ["teacher", "student", "parent", "employee", ...ADMIN_ROLES] },
            { key: "settings", label: "الإعدادات", to: "/settings", icon: PiGearBold, roles: ["teacher", "student", "parent", "employee", ...ADMIN_ROLES] },
        ],
    },
]
