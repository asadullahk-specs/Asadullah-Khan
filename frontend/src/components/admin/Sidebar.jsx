import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, User, Upload, Info, Sparkles, Award,
  FolderKanban, Mail, LayoutPanelTop, MessageSquare, Settings, X,
} from 'lucide-react'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Home Hero', icon: User },
  { to: '/admin/uploads', label: 'Uploads', icon: Upload },
  { to: '/admin/about', label: 'About Page', icon: Info },
  { to: '/admin/skills', label: 'About Skills', icon: Sparkles },
  { to: '/admin/certifications', label: 'Certifications', icon: Award },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/contact', label: 'Contact', icon: Mail },
  { to: '/admin/footer', label: 'Footer', icon: LayoutPanelTop },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-lightCard dark:bg-darkCard border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</div>
            <div className="font-semibold text-gray-900 dark:text-white">Portfolio CMS</div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-600 dark:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 overflow-y-auto h-[calc(100vh-80px)]">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
