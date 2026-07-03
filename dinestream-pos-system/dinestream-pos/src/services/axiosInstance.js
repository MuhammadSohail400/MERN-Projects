import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ───────────────────────────────────────
// Har request mein token automatically attach karo
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ds_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────
// 401 aaye → logout karo → login pe bhejo
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ds_token')
      localStorage.removeItem('ds_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance