import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2, X } from 'lucide-react'
import api from '../../services/api.js'
import { PageHeader, Card, Button, Toast, Spinner } from '../../components/admin/ui.jsx'

export default function Messages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/messages')
      .then(({ data }) => { if (data?.data) setItems(data.data) })
      .catch(() => setToast({ message: 'Could not load messages.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const view = async (m) => {
    setOpen(m)
    if (!m.isRead) {
      try {
        await api.patch(`/messages/${m.id}/read`, { isRead: true })
        setItems((prev) => prev.map((x) => x.id === m.id ? { ...x, isRead: true } : x))
      } catch { /* non-critical */ }
    }
  }

  const toggleRead = async (id) => {
    const target = items.find((x) => x.id === id)
    const next = !target.isRead
    try {
      await api.patch(`/messages/${id}/read`, { isRead: next })
      setItems((prev) => prev.map((x) => x.id === id ? { ...x, isRead: next } : x))
      setOpen((o) => (o && o.id === id ? { ...o, isRead: next } : o))
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to update.', type: 'error' })
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await api.delete(`/messages/${id}`)
      setItems((prev) => prev.filter((x) => x.id !== id))
      setOpen(null)
      setToast({ message: 'Deleted.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to delete.', type: 'error' })
    } finally {
      setTimeout(() => setToast({ message: '', type: 'success' }), 1800)
    }
  }

  if (loading) return <Spinner label="Loading messages…" />

  return (
    <div>
      <PageHeader title="Messages" subtitle="Contact form submissions." />
      <Card className="!p-0 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.length === 0 && <div className="p-8 text-center text-gray-500">No messages yet.</div>}
          {items.map((m) => (
            <div key={m.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => view(m)}>
              <div className={`mt-1 ${m.isRead ? 'text-gray-400' : 'text-accent'}`}>
                {m.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className={`font-medium truncate ${m.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                    {m.firstName} {m.lastName} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">&lt;{m.email}&gt;</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{m.createdAt}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{m.message}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-lightCard dark:bg-darkCard rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Message</h3>
              <button onClick={() => setOpen(null)} className="text-gray-500"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div><span className="text-gray-500">From:</span> <span className="text-gray-900 dark:text-white font-medium">{open.firstName} {open.lastName}</span></div>
              <div><span className="text-gray-500">Email:</span> <a href={`mailto:${open.email}`} className="text-accent hover:underline">{open.email}</a></div>
              {open.phone && <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900 dark:text-white">{open.phone}</span></div>}
              <div><span className="text-gray-500">Received:</span> <span className="text-gray-900 dark:text-white">{open.createdAt}</span></div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{open.message}</div>
              </div>
            </div>
            <div className="flex gap-2 justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" onClick={() => toggleRead(open.id)}>Mark {open.isRead ? 'Unread' : 'Read'}</Button>
              <Button variant="danger" onClick={() => remove(open.id)}><Trash2 size={14} /> Delete</Button>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
