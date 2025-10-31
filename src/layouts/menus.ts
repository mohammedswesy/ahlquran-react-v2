import type { ElementType } from "react"
import {
    LayoutDashboard, School, Users, UserCog, BookOpen, ClipboardList,
    Megaphone, LineChart, FileText, Bell, Settings, Library, IdCard, Laptop
} from "lucide-react"

export type Role =
    | "super-admin" | "org-admin" | "institute-admin" | "sub-admin"
    | "teacher" | "student" | "parent" | "employee"

export type MenuItem = {
    label: string
    to: string
    icon?: ElementType
}

export type MenuSection = {
    title?: string
    items: MenuItem[]
}

export function getMenuForRole(role: Role | null | undefined): MenuSection[] {
    // أدوار المشرفين (نفس المنيو)
    const isAdmin =
        role === "super-admin" ||
        role === "org-admin" ||
        role === "institute-admin" ||
        role === "sub-admin"

    if (isAdmin) {
        return [
            {
                items: [
                    { label: "لوحة القيادة", to: "/admin", icon: LayoutDashboard },
                ]
            },
            {
                title: "الإدارة",
                items: [
                    { label: "المعاهد", to: "/admin/institutes", icon: School },
                    { label: "الحلقات", to: "/admin/circles", icon: BookOpen },
                    { label: "المعلّمون", to: "/admin/employees", icon: UserCog },
                    { label: "الطلاب", to: "/admin/students", icon: Users },
                    { label: "أولياء الأمور", to: "/admin/parents", icon: Users },
                ]
            },
            {
                title: "تشغيل",
                items: [
                    { label: "الحضور والغياب", to: "/admin/attendance", icon: ClipboardList },
                    { label: "التقارير", to: "/admin/reports", icon: FileText },
                    { label: "الإشعارات", to: "/admin/notifications", icon: Bell },
                    { label: "إحصاءات", to: "/admin/stats", icon: LineChart },
                ]
            },
            {
                title: "أخرى",
                items: [
                    { label: "المكتبة", to: "/admin/library", icon: Library },
                    { label: "المقرأة الإلكترونية", to: "/admin/erecite", icon: Laptop },
                    { label: "إعداد البطاقات", to: "/admin/cards", icon: IdCard },
                    { label: "الإعدادات", to: "/admin/settings", icon: Settings },
                ]
            }
        ]
    }

    if (role === "teacher") {
        return [
            { items: [{ label: "لوحة القيادة", to: "/teacher", icon: LayoutDashboard }] },
            {
                title: "أدوات المعلم",
                items: [
                    { label: "حلقاتي", to: "/teacher/circles", icon: BookOpen },
                    { label: "تسجيل الحضور", to: "/teacher/attendance", icon: ClipboardList },
                    { label: "التقييمات", to: "/teacher/assessments", icon: FileText },
                ]
            }
        ]
    }

    if (role === "student") {
        return [
            { items: [{ label: "لوحة القيادة", to: "/student", icon: LayoutDashboard }] },
            {
                items: [
                    { label: "تقدّمي", to: "/student/progress", icon: LineChart },
                    { label: "جدولي", to: "/student/schedule", icon: ClipboardList },
                ]
            }
        ]
    }

    if (role === "parent") {
        return [
            { items: [{ label: "لوحة القيادة", to: "/parent", icon: LayoutDashboard }] },
            {
                items: [
                    { label: "أبنائي", to: "/parent/children", icon: Users },
                    { label: "التقارير", to: "/parent/reports", icon: FileText },
                ]
            }
        ]
    }

    if (role === "employee") {
        return [
            { items: [{ label: "لوحة القيادة", to: "/employee", icon: LayoutDashboard }] },
            {
                items: [
                    { label: "المهام", to: "/employee/tasks", icon: ClipboardList },
                    { label: "الأشخاص", to: "/employee/people", icon: Users },
                ]
            }
        ]
    }

    // افتراضي (لو مافي دور)
    return [
        { items: [{ label: "لوحة القيادة", to: "/admin", icon: LayoutDashboard }] },
    ]
}
