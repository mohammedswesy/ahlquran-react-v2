// services/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

/** إعدادات عامة */
const API_BASE  = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'token'

export const getToken   = () => localStorage.getItem(TOKEN_KEY)
export const setToken   = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

/** إنشاء instance موحد */
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  // لو تستخدم Sanctum بنظام الكوكيز:
  // withCredentials: true,
})

/** Request Interceptor: إضافة التوكن */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t: string | null = getToken()

  if (t) {
    (config.headers as any) = (config.headers ?? {})

    config.headers.Authorization = `Bearer ${t}`
  }
  return config
})


/** شكل الخطأ القياسي من API (اختياري) */
type ApiError = {
  status?: 'error' | 'fail'
  message?: string
  errors?: Record<string, string[] | string>
}

/** Response Interceptor: التعامل مع الأخطاء العامة */
let isHandling401 = false

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<ApiError>) => {
    const status = err.response?.status

    // 401/419: توكن منتهي أو غير مصرح
    if ((status === 401 || status === 419) && !isHandling401) {
      isHandling401 = true
      try {
        clearToken()
        if (typeof window !== 'undefined') window.location.href = '/login'
      } finally {
        isHandling401 = false
      }
    }

    // مرر الخطأ كما هو ليتعامل معه الـ UI
    return Promise.reject(err)
  }
)

export default api
