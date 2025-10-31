
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/auth'
export function ProtectedRoute(){ const {token}=useAuth(); return token? <Outlet/> : <Navigate to="/login" replace/> }
export function RoleGuard({allow}:{allow:string[]}){ const {role}=useAuth(); if(!role) return <Navigate to="/login" replace/>; if(!allow.includes(role)) return <Navigate to="/unauthorized" replace/>; return <Outlet/> }
