import api from "./api"
import { normalizeId } from "@/lib/normalize"

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | string

export type Attendance = {
    id: number
    date: string                 // YYYY-MM-DD
    start_time?: string | null   // HH:MM
    end_time?: string | null
    status?: AttendanceStatus | null
    notes?: string | null

    student_id: number
    circle_id?: number | null
    institute_id?: number | null

    // اختياري: علاقات لتسهيل العرض
    student?: { id: number; name: string }
    circle?: { id: number; name: string }
    institute?: { id: number; name: string }
    [k: string]: any
}

export type ListParams = {
    page?: number
    per_page?: number
    search?: string            // بحث عام (مثلاً باسم الطالب)
    date_from?: string         // YYYY-MM-DD
    date_to?: string           // YYYY-MM-DD
    status?: string
    institute_id?: number
    circle_id?: number
    student_id?: number
}

export type Paginated<T> = { data: T[]; meta?: any;[k: string]: any }

function normalizeTime(t: any): string | null | undefined {
    if (!t) return t
    const s = String(t).slice(0, 5)
    return /^\d{2}:\d{2}$/.test(s) ? s : String(t)
}

function normalizeAttendance(raw: any): Attendance {
    const x = normalizeId(raw)
    return {
        ...x,
        start_time: normalizeTime(x.start_time),
        end_time: normalizeTime(x.end_time),
    } as Attendance
}

function coerceNullish<T extends Record<string, any>>(o: T): T {
    const out: any = { ...o }
    for (const k in out) if (out[k] === "" || out[k] === undefined) out[k] = null
    return out
}

export async function listAttendances(params?: ListParams): Promise<Attendance[] | Paginated<Attendance>> {
    const { data } = await api.get("/attendances", { params })
    if (Array.isArray(data)) return data.map(normalizeAttendance)
    if (Array.isArray(data?.data)) return { ...data, data: data.data.map(normalizeAttendance) }
    return data
}

export async function getAttendance(id: number): Promise<Attendance> {
    const { data } = await api.get(`/attendances/${id}`)
    return normalizeAttendance(data?.data ?? data)
}

export async function createAttendance(payload: Partial<Attendance>): Promise<Attendance> {
    const { data } = await api.post("/attendances", coerceNullish(payload))
    return normalizeAttendance(data?.data ?? data)
}

export async function updateAttendance(id: number, payload: Partial<Attendance>): Promise<Attendance> {
    const { data } = await api.put(`/attendances/${id}`, coerceNullish(payload))
    return normalizeAttendance(data?.data ?? data)
}

export async function deleteAttendance(id: number) {
    const { data } = await api.delete(`/attendances/${id}`)
    return data
}
