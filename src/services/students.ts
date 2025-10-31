import api from "./api"
import { normalizeId } from "@/lib/normalize"

export type Student = {
  id: number
  name: string
  gender?: "male" | "female" | string
  birthdate?: string | null
  phone?: string | null
  institute_id?: number | null
  circle_id?: number | null
  status?: number | null
  // علاقات اختيارية قد ترجعها الـ API:
  institute?: { id: number; name: string }
  circle?: { id: number; name: string }
  [k: string]: any
}

export type ListParams = { page?: number; per_page?: number; search?: string }
export type Paginated<T> = { data: T[]; meta?: any; [k: string]: any }

function normalizeStudent(raw: any): Student {
  const withId = normalizeId(raw)
  return { ...withId } as Student
}

export async function listStudents(params?: ListParams): Promise<Student[] | Paginated<Student>> {
  const { data } = await api.get("/students", { params })
  if (Array.isArray(data)) return data.map(normalizeStudent)
  if (Array.isArray(data?.data)) return { ...data, data: data.data.map(normalizeStudent) }
  return data
}

export async function getStudent(id: number): Promise<Student> {
  const { data } = await api.get(`/students/${id}`)
  return normalizeStudent(data?.data ?? data)
}

export async function createStudent(payload: any): Promise<Student> {
  const { data } = await api.post("/students", payload)
  return normalizeStudent(data?.data ?? data)
}

export async function updateStudent(id: number, payload: any): Promise<Student> {
  const { data } = await api.put(`/students/${id}`, payload)
  return normalizeStudent(data?.data ?? data)
}

export async function deleteStudent(id: number) {
  const { data } = await api.delete(`/students/${id}`)
  return data
}
export async function listStudentsOptions(params?: { search?: string; institute_id?: number; circle_id?: number }) {
  const { data } = await api.get("/students", { params: { per_page: 1000, ...(params||{}) } })
  const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  return src.map((s: any) => {
    const rawId = s?.id ?? s?._id ?? s?.uuid ?? s?.ID
    return { id: Number(rawId), name: String(s?.name ?? "").trim() }
  })
}
