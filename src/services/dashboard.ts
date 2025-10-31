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
