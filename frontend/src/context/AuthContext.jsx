import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user') || 'null') } catch { return null }
  })
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    if (user) localStorage.setItem('admin_user', JSON.stringify(user))
    else localStorage.removeItem('admin_user')
  }, [user])

  // On first load, if a token exists, confirm it's still valid against the
  // backend (handles expired/invalid tokens left over from a previous visit).
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setCheckingSession(false); return }

    api.get('/auth/me')
      .then(({ data }) => {
        if (data?.admin) setUser(data.admin)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setCheckingSession(false))
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setUser(data.admin)
      return { ok: true }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials. Please try again.'
      return { ok: false, error: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, checkingSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
