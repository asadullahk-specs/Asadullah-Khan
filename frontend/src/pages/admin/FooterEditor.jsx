import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api.js'
import { footer as footerFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Textarea, Button, TagInput, Toast, Spinner } from '../../components/admin/ui.jsx'

const fallbackJoinUs = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/asadullahkhan' },
  { label: 'GitHub', url: 'https://github.com/asadullahkhan' },
  { label: 'Email', url: 'mailto:asadullah@example.com' },
]

export default function FooterEditor() {
  const [data, setData] = useState({
    footerSummaryText: footerFallback.footerSummaryText,
    footerSkillsList: footerFallback.footerSkillsList,
    joinUs: fallbackJoinUs,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/footer')
      .then(({ data: res }) => {
        if (!res?.data) return
        const f = res.data
        setData({
          footerSummaryText: f.footerSummaryText ?? footerFallback.footerSummaryText,
          footerSkillsList: f.footerSkillsList?.length ? f.footerSkillsList : footerFallback.footerSkillsList,
          joinUs: f.joinUsLinks?.length ? f.joinUsLinks : fallbackJoinUs,
        })
      })
      .catch(() => setToast({ message: 'Could not load footer settings — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const updateLink = (i, k, v) => setData({ ...data, joinUs: data.joinUs.map((x, j) => j === i ? { ...x, [k]: v } : x) })
  const addLink = () => setData({ ...data, joinUs: [...data.joinUs, { label: '', url: '' }] })
  const removeLink = (i) => setData({ ...data, joinUs: data.joinUs.filter((_, j) => j !== i) })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/footer', {
        footerSummaryText: data.footerSummaryText,
        footerSkillsList: data.footerSkillsList,
        joinUsLinks: data.joinUs,
      })
      setToast({ message: 'Footer saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading footer settings…" />

  return (
    <div>
      <PageHeader title="Footer" subtitle="Edit the site footer content and Join Us links." />
      <form onSubmit={save}>
        <Card className="mb-6">
          <Field label="Summary Text"><Textarea rows={3} value={data.footerSummaryText} onChange={(e) => setData({ ...data, footerSummaryText: e.target.value })} /></Field>
          <Field label="Footer List" hint="Shown as small tags under the summary text in the footer.">
            <TagInput value={data.footerSkillsList} onChange={(v) => setData({ ...data, footerSkillsList: v })} />
          </Field>
        </Card>
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Join Us Links</h3>
            <Button type="button" variant="secondary" onClick={addLink}>+ Add Link</Button>
          </div>
          {data.joinUs.map((l, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2 mb-2">
              <Input placeholder="Label" value={l.label} onChange={(e) => updateLink(i, 'label', e.target.value)} />
              <Input placeholder="URL" value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
              <Button type="button" variant="danger" onClick={() => removeLink(i)}>×</Button>
            </div>
          ))}
        </Card>
        <Button type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
