import api from "@/services/api"

export type ParentRow = {
    id: number
    relation_type: string | null
    children_count: number
    user?: {
        id: number
        name: string
        email?: string | null
        mobile?: string | null
    }
}

export type ParentsResponse = {
    data: ParentRow[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export async function fetchParents(params: { search?: string; page?: number; per_page?: number }) {
    const { data } = await api.get<ParentsResponse>("/parents", { params })
    return data
}
