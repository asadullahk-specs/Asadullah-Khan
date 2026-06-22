import axios from 'axios'

// Base API client, wired to the Express + MySQL backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Attach JWT token if present (admin dashboard requests)
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// If the admin's session has expired or the token is invalid, the backend
// responds 401. Clear local auth state and bounce to the login screen
// instead of leaving the dashboard in a broken half-authenticated state.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error?.response?.status === 401 &&
      window.location.pathname.startsWith('/admin') &&
      window.location.pathname !== '/admin/login'
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default api
