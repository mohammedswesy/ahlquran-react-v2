// src/services/attendances.ts
import api from "./api"
import { normalizeId } from "@/lib/normalize"

/* ================= Types ================= */
export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export type Attendance = {
    id: number
    date: string // YYYY-MM-DD
    start_time?: string | null // HH:MM
    end_time?: string | null
    status?: AttendanceStatus | null
    notes?: string | null

    student_id: number
    circle_id?: number | null
    institute_id?: number | null

    student?: { id: number; name: string }
    circle?: { id: number; name: string }
    institute?: { id: number; name: string }

    [k: string]: any
}

export type ListParams = {
    page?: number
    per_page?: number
    search?: string
    date_from?: string
    date_to?: string
    status?: AttendanceStatus
    institute_id?: number
    circle_id?: number
    student_id?: number
}

export type Paginated<T> = { data: T[]; meta?: any;[k: string]: any }

/* ================= Helpers ================= */
function normalizeTime(t: any): string | null {
    if (!t) return null
    const s = String(t).slice(0, 5)
    return /^\d{2}:\d{2}$/.test(s) ? s : null
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

/* ================= Admin / Sub-admin ================= */
/** GET /attendance */
export async function listAttendances(params?: ListParams): Promise<Paginated<Attendance> | Attendance[]> {
    const { data } = await api.get("/attendance", { params })

    // لو رجع Resource Collection
    if (Array.isArray(data?.data)) return { ...data, data: data.data.map(normalizeAttendance) }
    // لو رجع Array مباشر
    if (Array.isArray(data)) return data.map(normalizeAttendance)

    return data
}

/** PUT /attendance/{id} */
export async function updateAttendance(id: number, payload: Partial<Attendance>): Promise<Attendance> {
    const { data } = await api.put(`/attendance/${id}`, coerceNullish(payload))
    return normalizeAttendance(data?.data ?? data)
}

/** DELETE /attendance/{id} */
export async function deleteAttendance(id: number) {
    const { data } = await api.delete(`/attendance/${id}`)
    return data
}

/* ================= Teacher ================= */
/**
 * ✅ POST /attendance  (سجل واحد)
 * الباك عندك TeacherAttendanceController@store غالباً يتوقع student_id واحد
 */
export async function createAttendance(payload: {
    date: string
    circle_id: number
    student_id: number
    status: AttendanceStatus
    notes?: string | null
    start_time?: string | null
    end_time?: string | null
    institute_id?: number | null
}): Promise<Attendance> {
    const { data } = await api.post("/attendance", coerceNullish(payload))
    return normalizeAttendance(data?.data ?? data)
}

/**
 * ✅ تسجيل حضور جماعي بدون تعديل الباك:
 * بنعمل POST لكل طالب
 */
export async function submitAttendance(payload: {
    date: string
    circle_id: number
    records: Array<{ student_id: number; status: AttendanceStatus; notes?: string | null }>
}) {
    const { date, circle_id, records } = payload

    // sequential (أضمن وأخف على السيرفر)
    for (const r of records) {
        await createAttendance({
            date,
            circle_id,
            student_id: r.student_id,
            status: r.status,
            notes: r.notes ?? null,
        })
    }

    return { message: "saved" }
}
