
import axios from 'axios'
const api=axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' })
api.interceptors.request.use((config)=>{ const t=localStorage.getItem('token'); if(t){config.headers=config.headers||{};config.headers.Authorization=`Bearer ${t}`;config.headers.Accept='application/json'}; return config })
export default api
