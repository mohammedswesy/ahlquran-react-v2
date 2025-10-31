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
