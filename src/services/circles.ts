import api from "./api"
import { normalizeId } from "@/lib/normalize"

export type Circle = {
    id: number
    name: string
    institute_id: number
    [k: string]: any
}

function normalizeCircle(raw: any): Circle {
    const withId = normalizeId(raw)
    return { ...withId } as Circle
}

/** عامّة */
export async function listCircles(params?: { institute_id?: number; search?: string }) {
    const { data } = await api.get("/circles", { params })
    if (Array.isArray(data)) return data.map(normalizeCircle)
    if (Array.isArray(data?.data)) return data.data.map(normalizeCircle)
    return []
}

/** حسب معهد */
export async function listCirclesByInstitute(institute_id: number) {
    return listCircles({ institute_id })
}
//TeacherCircle
export type TeacherCircle = {
    id: number
    name: string
    institute_id?: number | null
    institute_name?: string | null
    students_count?: number
    schedule?: string | null
    [k: string]: any
}

function normalizeCircleRow(raw: any): TeacherCircle {
    const x = normalizeId(raw)
    return {
        ...x,
        institute_name: x.institute_name ?? x.institute?.name ?? null,
        students_count: Number.isFinite(Number(x.students_count)) ? Number(x.students_count) : 0,
        schedule: x.schedule ?? null,
    }
}

/** حلقات المعلّم الحالي */
export async function listMyCircles(): Promise<TeacherCircle[]> {
    const { data } = await api.get("/teacher/circles") // غيّر المسار إذا API مختلف
    const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
    return src.map(normalizeCircleRow)
}