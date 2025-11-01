import api from './api'
import type { Institute } from './institutes'

export type DashboardStats = {
    parents: number
    circles: number
    teachers: number
    students: number
}

export type DashboardResponse = {
    stats: DashboardStats
    recentInstitutes: Institute[]
}

export type AttendancePoint = {
    date: string
    present: number
    absent: number
    late: number
    excused: number
}


export async function fetchDashboard(): Promise<DashboardResponse> {
    // عدّل المسار إذا مختلف عندك في Laravel
    const { data } = await api.get('/admin/dashboard')
    return {
        stats: {
            parents: data?.stats?.parents ?? 0,
            circles: data?.stats?.circles ?? 0,
            teachers: data?.stats?.teachers ?? 0,
            students: data?.stats?.students ?? 0,
        },
        recentInstitutes: data?.recent_institutes ?? [],
    }
}

// ===== Teacher dashboard types =====
export type TeacherAttendancePoint = {
    date: string
    circle?: string
    present: number
    absent: number
    late: number
    excused: number
}

export type TeacherDashboard = {
    totals: { circles: number; students: number }
    recentAttendance: TeacherAttendancePoint[]
}

// يدعم أشكال استجابة مختلفة
export async function fetchTeacherDashboard(): Promise<TeacherDashboard> {
    const { data } = await api.get("/dashboard/teacher").catch(() => ({ data: {} as any }))

    const totalsSrc = (data?.totals ?? data?.stats ?? {}) as any
    const attendanceSrc =
        (data?.recentAttendance ??
            data?.attendance_week ??
            data?.attendance?.week ??
            []) as any[]

    const totals = {
        circles: Number(totalsSrc.circles ?? totalsSrc.my_circles ?? 0),
        students: Number(totalsSrc.students ?? totalsSrc.my_students ?? 0),
    }

    const recentAttendance: TeacherAttendancePoint[] = Array.isArray(attendanceSrc)
        ? attendanceSrc.map((p) => ({
            date: String(p.date ?? p.day ?? ""),
            circle: String(p.circle ?? p.circle_name ?? p.class ?? ""),
            present: Number(p.present ?? p.p ?? 0),
            absent: Number(p.absent ?? p.a ?? 0),
            late: Number(p.late ?? p.l ?? 0),
            excused: Number(p.excused ?? p.e ?? 0),
        }))
        : []

    return { totals, recentAttendance }
}
