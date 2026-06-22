import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import api from '../../services/api.js'
import { aboutPage as aboutPageFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Textarea, Button, TagInput, Toast, Spinner, UploadField } from '../../components/admin/ui.jsx'

export default function AboutEditor() {
  const [data, setData] = useState(aboutPageFallback)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/about')
      .then(({ data: res }) => { if (res?.data) setData((d) => ({ ...d, ...res.data })) })
      .catch(() => setToast({ message: 'Could not load About page — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const updateP = (i, v) => setData({ ...data, aboutPageParagraphs: data.aboutPageParagraphs.map((p, j) => j === i ? v : p) })
  const addP = () => setData({ ...data, aboutPageParagraphs: [...data.aboutPageParagraphs, ''] })
  const removeP = (i) => setData({ ...data, aboutPageParagraphs: data.aboutPageParagraphs.filter((_, j) => j !== i) })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/about', data)
      setToast({ message: 'About page saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading About page…" />

  return (
    <div>
      <PageHeader title="About Page" subtitle="Edit the About page intro paragraphs and skills." />
      <form onSubmit={save}>
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Paragraphs</h3>
            <Button type="button" variant="secondary" onClick={addP}><Plus size={14} /> Add</Button>
          </div>
          {data.aboutPageParagraphs.map((p, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <Textarea rows={3} value={p} onChange={(e) => updateP(i, e.target.value)} />
              <Button type="button" variant="danger" onClick={() => removeP(i)}><Trash2 size={14} /></Button>
            </div>
          ))}
        </Card>
        <Card className="mb-6">
          <Field label="Skill Badges"><TagInput value={data.aboutPageSkills} onChange={(v) => setData({ ...data, aboutPageSkills: v })} /></Field>
          <Field label="CV Attachment"><UploadField kind="document" value={data.cvAttachmentUrl} onChange={(v) => setData({ ...data, cvAttachmentUrl: v })} /></Field>
        </Card>
        <Button type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
