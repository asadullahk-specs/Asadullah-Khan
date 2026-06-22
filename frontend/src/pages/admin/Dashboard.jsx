import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Award, MessageSquare, Upload, ArrowRight } from 'lucide-react'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { projects as projectsFallback, certifications as certificationsFallback } from '../../data/dummy.js'
import { PageHeader, Card } from '../../components/admin/ui.jsx'

const quickLinks = [
  { to: '/admin/hero', label: 'Edit Home Hero' },
  { to: '/admin/about', label: 'Edit About Page' },
  { to: '/admin/projects', label: 'Manage Projects' },
  { to: '/admin/messages', label: 'View Messages' },
  { to: '/admin/footer', label: 'Edit Footer' },
  { to: '/admin/settings', label: 'Site Settings' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState(projectsFallback)
  const [certCount, setCertCount] = useState(certificationsFallback.length)
  const [unreadCount, setUnreadCount] = useState(0)
  const [uploadsCount, setUploadsCount] = useState(0)

  useEffect(() => {
    api.get('/projects').then(({ data }) => { if (data?.data) setProjects(data.data) }).catch(() => {})
    api.get('/certifications').then(({ data }) => { if (data?.data) setCertCount(data.data.length) }).catch(() => {})
    api.get('/messages').then(({ data }) => { if (typeof data?.unreadCount === 'number') setUnreadCount(data.unreadCount) }).catch(() => {})
    api.get('/uploads').then(({ data }) => { if (data?.data) setUploadsCount(data.data.length) }).catch(() => {})
  }, [])

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban, to: '/admin/projects', color: 'bg-blue-500' },
    { label: 'Certifications', value: certCount, icon: Award, to: '/admin/certifications', color: 'bg-amber-500' },
    { label: 'Unread Messages', value: unreadCount, icon: MessageSquare, to: '/admin/messages', color: 'bg-emerald-500' },
    { label: 'Uploads', value: uploadsCount, icon: Upload, to: '/admin/uploads', color: 'bg-violet-500' },
  ]

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}`} subtitle="Overview of your portfolio content." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={label} to={to} className="block">
            <Card className="hover:border-accent transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
                </div>
                <div className={`p-2.5 rounded-lg text-white ${color}`}><Icon size={20} /></div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <img src={p.projectImage} alt="" className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{p.projectCategory}</div>
                </div>
                {p.isRecent && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">Recent</span>}
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet.</p>}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-1">
            {quickLinks.map((q) => (
              <Link key={q.to} to={q.to} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                {q.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
