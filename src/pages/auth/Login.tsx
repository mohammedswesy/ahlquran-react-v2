
import { useForm } from 'react-hook-form'
import api from '@/services/api'
import { useAuth } from '@/store/auth'
import { useNavigate } from 'react-router-dom'
type Inputs={ email:string; password:string }
export default function Login(){
  const {register,handleSubmit}=useForm<Inputs>(); const {setToken,setRole}=useAuth(); const nav=useNavigate()
  const onSubmit=async(d:Inputs)=>{ try{ const res=await api.post('/auth/login',d); setToken(res.data.token); setRole(res.data.role); nav('/admin') }catch{ alert('Login failed') } }
  return (<div className="min-h-screen grid place-items-center">
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow w-[360px] space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Email" {...register('email')} />
      <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" {...register('password')} />
      <button className="w-full bg-black text-white rounded px-3 py-2">Login</button>
    </form></div>)
}
