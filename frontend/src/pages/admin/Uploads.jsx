import { useEffect, useState } from 'react'
import { Upload as UploadIcon, Trash2, FileText, Image as ImgIcon, Copy } from 'lucide-react'
import api from '../../services/api.js'
import { PageHeader, Card, Button, Toast, Spinner } from '../../components/admin/ui.jsx'

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

export default function Uploads() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const load = () => {
    api.get('/uploads')
      .then(({ data }) => { if (data?.data) setFiles(data.data) })
      .catch(() => setToast({ message: 'Could not load uploads.', type: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onUpload = async (e) => {
    const list = Array.from(e.target.files || [])
    e.target.value = ''
    if (!list.length) return
    setUploading(true)
    try {
      await Promise.all(
        list.map((f) => {
          const formData = new FormData()
          formData.append('file', f)
          return api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        })
      )
      setToast({ message: `${list.length} file(s) uploaded.`, type: 'success' })
      load()
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Upload failed.', type: 'error' })
    } finally {
      setUploading(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this file?')) return
    try {
      await api.delete(`/uploads/${id}`)
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to delete.', type: 'error' })
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000)
    }
  }

  const copy = (url) => {
    navigator.clipboard.writeText(url)
    setToast({ message: 'URL copied.', type: 'success' })
    setTimeout(() => setToast({ message: '', type: 'success' }), 1500)
  }

  if (loading) return <Spinner label="Loading uploads…" />

  return (
    <div>
      <PageHeader
        title="Uploads"
        subtitle="Manage images, PDFs, and documents used across the site."
        actions={
          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent hover:bg-accentHover text-white cursor-pointer">
            <UploadIcon size={16} /> {uploading ? 'Uploading…' : 'Upload Files'}
            <input type="file" multiple className="hidden" onChange={onUpload} disabled={uploading} />
          </label>
        }
      />
      <Card>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((f) => (
              <div key={f.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {f.type === 'image'
                    ? <img src={f.url} alt="" className="w-full h-full object-cover" />
                    : <FileText size={48} className="text-gray-400" />}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    {f.type === 'image' ? <ImgIcon size={12} /> : <FileText size={12} />}
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{f.type}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatSize(f.size)}</div>
                  <div className="flex gap-1.5">
                    <Button variant="secondary" className="flex-1 justify-center !px-2 !py-1.5" onClick={() => copy(f.url)}><Copy size={14} /></Button>
                    <Button variant="danger" className="!px-2 !py-1.5" onClick={() => remove(f.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
