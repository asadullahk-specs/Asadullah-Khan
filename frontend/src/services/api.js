import axios from 'axios'

// Base API client, wired to the Express + MongoDB backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// In-memory token store — lives only for the current page lifecycle.
// A page refresh wipes this variable, which forces a fresh login every time.
let _token = null
export const setAuthToken  = (t) => { _token = t }
export const clearAuthToken = () => { _token = null }

// Attach the token on every request (if present).
api.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`
  return cfg
})

// If the backend returns 401 while inside the admin panel, clear the in-memory
// token and redirect to the login page.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error?.response?.status === 401 &&
      window.location.pathname.startsWith('/admin') &&
      window.location.pathname !== '/admin/login'
    ) {
      clearAuthToken()
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default api
