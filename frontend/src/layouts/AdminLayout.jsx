import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, LogOut, ExternalLink } from 'lucide-react'
import Sidebar from '../components/admin/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-lightBg dark:bg-darkBg">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-lightCard/90 dark:bg-darkCard/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="lg:hidden text-gray-700 dark:text-gray-300">
                <Menu size={22} />
              </button>
              <h1 className="font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-accent">
                <ExternalLink size={16} /> View Site
              </Link>
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accentHover text-white text-sm"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
