import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import api from '../../services/api.js'
import { certifications as seedFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Button, Toast, Spinner, UploadField } from '../../components/admin/ui.jsx'

const empty = { id: null, title: '', issuer: '', duration: '', certificateImage: '', pdfDocument: '' }

export default function CertificationsEditor() {
  const [items, setItems] = useState(seedFallback)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const load = () => {
    api.get('/certifications')
      .then(({ data }) => { if (data?.data) setItems(data.data) })
      .catch(() => setToast({ message: 'Could not load certifications — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openNew = () => setEditing({ ...empty })
  const openEdit = (c) => setEditing({ ...c })
  const close = () => setEditing(null)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: editing.title,
      issuer: editing.issuer,
      duration: editing.duration,
      certificateImage: editing.certificateImage,
      pdfDocument: editing.pdfDocument,
    }
    try {
      if (editing.id == null) await api.post('/certifications', payload)
      else await api.put(`/certifications/${editing.id}`, payload)
      setToast({ message: 'Certification saved.', type: 'success' })
      close()
      load()
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this certification?')) return
    try {
      await api.delete(`/certifications/${id}`)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to delete.', type: 'error' })
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading certifications…" />

  return (
    <div>
      <PageHeader
        title="Certifications"
        subtitle="Manage the certifications carousel on the About page."
        actions={<Button onClick={openNew}><Plus size={14} /> Add Certification</Button>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Card key={c.id} className="!p-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
              {c.certificateImage && <img src={c.certificateImage} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">{c.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{c.issuer}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.duration}</div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => openEdit(c)}><Pencil size={14} /> Edit</Button>
              <Button variant="danger" onClick={() => remove(c.id)}><Trash2 size={14} /></Button>
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-10">No certifications yet — add your first one.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-lightCard dark:bg-darkCard rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{editing.id == null ? 'Add' : 'Edit'} Certification</h3>
              <button onClick={close} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={save} className="p-5">
              <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
              <Field label="Issuer / Organizer"><Input value={editing.issuer} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} required /></Field>
              <Field label="Duration / Date"><Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></Field>
              <Field label="Certificate Image"><UploadField kind="image" value={editing.certificateImage} onChange={(v) => setEditing({ ...editing, certificateImage: v })} /></Field>
              <Field label="PDF Document"><UploadField kind="document" value={editing.pdfDocument} onChange={(v) => setEditing({ ...editing, pdfDocument: v })} /></Field>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
                <Button type="submit" disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
