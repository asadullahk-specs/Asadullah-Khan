import { createContext, useContext, useState } from 'react'
import api, { setAuthToken, clearAuthToken } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // State starts as null on every page load — no storage is read.
  // A page refresh always resets to "not logged in".
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      // Store token only in memory — wiped on refresh.
      setAuthToken(data.token)
      setUser(data.admin)
      return { ok: true }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials. Please try again.'
      return { ok: false, error: msg }
    }
  }

  const logout = () => {
    clearAuthToken()
    setUser(null)
  }

  // Call this after a successful email update so the header reflects the
  // new address without forcing a logout/login cycle.
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, checkingSession: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
