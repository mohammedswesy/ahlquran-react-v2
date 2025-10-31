// src/store/auth.ts
import { create } from "zustand"

export type Role =
  | "super-admin" | "org-admin" | "institute-admin" | "sub-admin"
  | "teacher" | "student" | "parent" | "employee"

export type User = {
  id: number
  name: string
  role: Role
  email?: string | null
  [k: string]: any
}

interface AuthState {
  token: string | null
  role: Role | null
  user: User | null
  setToken: (t: string | null) => void
  setRole: (r: Role | null) => void
  setUser: (u: User | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as Role) || null,
  user: null,

  setToken: (t) => { t ? localStorage.setItem("token", t) : localStorage.removeItem("token"); set({ token: t }) },
  setRole: (r) => { r ? localStorage.setItem("role", r) : localStorage.removeItem("role"); set({ role: r }) },
  setUser: (u) => set({ user: u }),

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    set({ token: null, role: null, user: null })
  },
}))

export { useAuth as useAuthStore }
