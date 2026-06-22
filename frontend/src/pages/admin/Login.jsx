import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.ok) navigate(from, { replace: true })
    else setError(res.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-lightCard dark:bg-darkCard rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-3">
            <Lock size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sign in to System</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-lightBg dark:bg-darkBg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Enter your password"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-lightBg dark:bg-darkBg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accentHover text-white font-medium transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          If you have forgot your password, check <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">WhatsApp</code>.
          <div className="mt-2"><Link to="/" className="hover:text-accent">← Back to site</Link></div>
        </div>
      </motion.div>
    </div>
  )
}
