
import { create } from 'zustand'
type Role='super-admin'|'org-admin'|'institute-admin'|'sub-admin'|'teacher'|'student'|'parent'|'employee'
interface AuthState { token:string|null; role:Role|null; setToken:(t:string|null)=>void; setRole:(r:Role|null)=>void; logout:()=>void }
export const useAuth=create<AuthState>((set)=>({
  token:localStorage.getItem('token'), role:(localStorage.getItem('role') as Role)||null,
  setToken:(t)=>{ t?localStorage.setItem('token',t):localStorage.removeItem('token'); set({token:t}) },
  setRole:(r)=>{ r?localStorage.setItem('role',r):localStorage.removeItem('role'); set({role:r}) },
  logout:()=>{ localStorage.removeItem('token'); localStorage.removeItem('role'); set({token:null,role:null}) }
}))
