import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import api from '../../services/api.js'
import { skillsSection as skillsSectionFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Textarea, Button, TagInput, Toast, Spinner } from '../../components/admin/ui.jsx'

export default function SkillsEditor() {
  const [data, setData] = useState(skillsSectionFallback)
  const [originalIds, setOriginalIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const load = () => {
    api.get('/skills')
      .then(({ data: res }) => {
        if (!res?.data) return
        setData(res.data)
        setOriginalIds(res.data.skillsCategories.map((c) => c.id).filter(Boolean))
      })
      .catch(() => setToast({ message: 'Could not load skills section — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const updateCat = (i, k, v) => setData({ ...data, skillsCategories: data.skillsCategories.map((c, j) => j === i ? { ...c, [k]: v } : c) })
  const addCat = () => setData({ ...data, skillsCategories: [...data.skillsCategories, { categoryName: '', categoryDescription: '', subSkills: [] }] })
  const removeCat = (i) => setData({ ...data, skillsCategories: data.skillsCategories.filter((_, j) => j !== i) })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/skills/intro', { skillsIntroParagraph: data.skillsIntroParagraph })

      const currentIds = data.skillsCategories.map((c) => c.id).filter(Boolean)
      const deletedIds = originalIds.filter((id) => !currentIds.includes(id))

      await Promise.all([
        ...deletedIds.map((id) => api.delete(`/skills/categories/${id}`)),
        ...data.skillsCategories.map((c) => {
          const payload = { categoryName: c.categoryName, categoryDescription: c.categoryDescription, subSkills: c.subSkills }
          return c.id ? api.put(`/skills/categories/${c.id}`, payload) : api.post('/skills/categories', payload)
        }),
      ])

      setToast({ message: 'Skills section saved.', type: 'success' })
      load() // refresh so new categories pick up their real IDs
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading skills section…" />

  return (
    <div>
      <PageHeader
        title="About Skills"
        subtitle="Edit the skills section shown on the About page."
        actions={<Button type="button" variant="secondary" onClick={addCat}><Plus size={14} /> Add Category</Button>}
      />
      <form onSubmit={save}>
        <Card className="mb-6">
          <Field label="Intro Paragraph"><Textarea rows={3} value={data.skillsIntroParagraph} onChange={(e) => setData({ ...data, skillsIntroParagraph: e.target.value })} /></Field>
        </Card>
        <div className="space-y-4 mb-6">
          {data.skillsCategories.map((c, i) => (
            <Card key={c.id ?? `new-${i}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Category {i + 1}</h3>
                <Button type="button" variant="danger" onClick={() => removeCat(i)}><Trash2 size={14} /></Button>
              </div>
              <Field label="Name"><Input value={c.categoryName} onChange={(e) => updateCat(i, 'categoryName', e.target.value)} /></Field>
              <Field label="Description"><Input value={c.categoryDescription} onChange={(e) => updateCat(i, 'categoryDescription', e.target.value)} /></Field>
              <Field label="Sub Skills"><TagInput value={c.subSkills} onChange={(v) => updateCat(i, 'subSkills', v)} /></Field>
            </Card>
          ))}
        </div>
        <Button type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
