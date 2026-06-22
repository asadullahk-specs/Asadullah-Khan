import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react'
import api from '../../services/api.js'
import { projects as seedFallback, projectsPage as projectsPageFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Textarea, Select, Button, TagInput, Toast, Spinner, UploadField } from '../../components/admin/ui.jsx'

const empty = {
  id: null, title: '', description: '', technologies: [], projectImage: '',
  detailsLink: '', isRecent: false, projectCategory: 'Web App',
}

export default function ProjectsEditor() {
  const [items, setItems] = useState(seedFallback)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const [introText, setIntroText] = useState(projectsPageFallback.projectsPageIntroText)
  const [savingIntro, setSavingIntro] = useState(false)

  const load = () => {
    api.get('/projects')
      .then(({ data }) => { if (data?.data) setItems(data.data) })
      .catch(() => setToast({ message: 'Could not load projects — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    api.get('/projects/page-settings')
      .then(({ data }) => { if (data?.data?.projectsPageIntroText) setIntroText(data.data.projectsPageIntroText) })
      .catch(() => { /* keep fallback */ })
  }, [])

  const categories = ['All', ...new Set(items.map((p) => p.projectCategory).filter(Boolean))]
  const filtered = filter === 'All' ? items : items.filter((p) => p.projectCategory === filter)

  const saveIntro = async (e) => {
    e.preventDefault()
    setSavingIntro(true)
    try {
      await api.put('/projects/page-settings', { projectsPageIntroText: introText })
      setToast({ message: 'Projects page header saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSavingIntro(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: editing.title,
      description: editing.description,
      technologies: editing.technologies,
      projectImage: editing.projectImage,
      detailsLink: editing.detailsLink,
      isRecent: editing.isRecent,
      projectCategory: editing.projectCategory,
    }
    try {
      if (editing.id == null) await api.post('/projects', payload)
      else await api.put(`/projects/${editing.id}`, payload)
      setToast({ message: 'Project saved.', type: 'success' })
      setEditing(null)
      load()
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to delete.', type: 'error' })
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading projects…" />

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage portfolio projects. Mark items as 'Recent' to feature on the home page."
        actions={<Button onClick={() => setEditing({ ...empty })}><Plus size={14} /> Add Project</Button>}
      />

      <Card className="mb-6">
        <form onSubmit={saveIntro} className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <Field label="Projects Page Header Text" hint="Shown under the 'My Projects' heading on the Projects page.">
              <Input value={introText} onChange={(e) => setIntroText(e.target.value)} />
            </Field>
          </div>
          <Button type="submit" disabled={savingIntro} className="shrink-0">{savingIntro ? 'Saving…' : 'Save Header'}</Button>
        </form>
      </Card>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-sm ${filter === c ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="!p-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
              {p.projectImage && <img src={p.projectImage} alt="" className="w-full h-full object-cover" />}
              {p.isRecent && <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-xs"><Star size={10} /> Recent</span>}
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">{p.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{p.projectCategory}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{p.description}</div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setEditing({ ...p })}><Pencil size={14} /> Edit</Button>
              <Button variant="danger" onClick={() => remove(p.id)}><Trash2 size={14} /></Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-10">No projects in this category yet.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-lightCard dark:bg-darkCard rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{editing.id == null ? 'Add' : 'Edit'} Project</h3>
              <button onClick={() => setEditing(null)} className="text-gray-500"><X size={20} /></button>
            </div>
            <form onSubmit={save} className="p-5">
              <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
              <Field label="Description"><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
              <Field label="Category">
                <Select value={editing.projectCategory} onChange={(e) => setEditing({ ...editing, projectCategory: e.target.value })}>
                  {['Web App', 'Mobile', 'Landing Page', 'Dashboard', 'Other'].map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Technologies"><TagInput value={editing.technologies} onChange={(v) => setEditing({ ...editing, technologies: v })} /></Field>
              <Field label="Project Image"><UploadField kind="image" value={editing.projectImage} onChange={(v) => setEditing({ ...editing, projectImage: v })} /></Field>
              <Field label="Details Link"><Input value={editing.detailsLink} onChange={(e) => setEditing({ ...editing, detailsLink: e.target.value })} /></Field>
              <label className="flex items-center gap-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={editing.isRecent} onChange={(e) => setEditing({ ...editing, isRecent: e.target.checked })} className="accent-accent" />
                Mark as Recent (featured on home page)
              </label>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
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
