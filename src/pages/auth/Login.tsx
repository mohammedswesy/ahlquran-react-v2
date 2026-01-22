// src/pages/auth/Login.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/services/auth"
import { useAuth, type Role } from "@/store/auth"
import { useEffect } from "react"


export default function Login() {
  const [email, setEmail] = useState("admin@ahlquran.test")
  const [password, setPassword] = useState("12345678")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  const { setToken, setRole } = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { token, role } = await login({ email, password })
      const r = (role as Role) || "super-admin"

      setToken(token)
      setRole(r)

      if (r === "teacher") nav("/teacher")
      else if (r === "parent") nav("/parent")
      else if (r === "employee") nav("/employee")
      else if (r === "student") nav("/student")
      else if (r === "institute-admin" || r === "sub-admin")
        nav("/institute/dashboard")
      else nav("/admin")
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }
  const { token, role } = useAuth()

  useEffect(() => {
    if (token && role) {
      if (role === "teacher") nav("/teacher")
      else if (role === "parent") nav("/parent")
      else if (role === "employee") nav("/employee")
      else if (role === "student") nav("/student")
      else if (role === "institute-admin" || role === "sub-admin") nav("/institute/dashboard")
      else nav("/admin")
    }
  }, [token, role])


  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-sm grid gap-3"
      >
        <h1 className="text-xl font-bold">Sign in</h1>
        {error && <div className="text-red-600">{error}</div>}

        <input
          className="border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button
          disabled={loading}
          className="bg-black text-white rounded px-3 py-2"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>


  )

}

