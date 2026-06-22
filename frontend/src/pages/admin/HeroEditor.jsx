import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api.js'
import { hero as heroFallback, aboutPreview as aboutPreviewFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Textarea, Button, TagInput, Toast, Spinner, UploadField } from '../../components/admin/ui.jsx'

export default function HeroEditor() {
  const [data, setData] = useState({ ...heroFallback, ...aboutPreviewFallback })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/hero')
      .then(({ data: res }) => {
        if (res?.data) setData((d) => ({ ...d, ...res.data }))
      })
      .catch(() => setToast({ message: 'Could not load hero data — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setData({ ...data, [k]: v })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/hero', data)
      setToast({ message: 'Hero section saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading hero section…" />

  return (
    <div>
      <PageHeader title="Home Hero" subtitle="Edit the landing-page hero section." />
      <form onSubmit={save} className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Field label="Static Heading"><Input value={data.staticHeading} onChange={(e) => set('staticHeading', e.target.value)} /></Field>
          <Field label="Typewriter Texts" hint="Rotating tagline phrases shown after the heading.">
            <TagInput value={data.typewriterTexts} onChange={(v) => set('typewriterTexts', v)} />
          </Field>
          <Field label="Paragraph"><Textarea rows={4} value={data.paragraphText} onChange={(e) => set('paragraphText', e.target.value)} /></Field>
          <Field label="Skill Tags"><TagInput value={data.skills} onChange={(v) => set('skills', v)} /></Field>
          <Field label="CV Document"><UploadField kind="document" value={data.cvDoc} onChange={(v) => set('cvDoc', v)} /></Field>
        </Card>
        <div className="space-y-6">
          <Card>
            <Field label="Hero Image">
              <UploadField kind="image" value={data.heroImage} onChange={(v) => set('heroImage', v)} />
            </Field>
          </Card>
          <Button type="submit" disabled={saving} className="w-full justify-center"><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>

        <Card className="lg:col-span-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">About Preview (Home Page)</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Shown in the "About Preview" section just below the hero on the Home page.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Field label="Heading"><Input value={data.aboutPreviewHeading} onChange={(e) => set('aboutPreviewHeading', e.target.value)} /></Field>
              <Field label="Text"><Textarea rows={4} value={data.aboutPreviewText} onChange={(e) => set('aboutPreviewText', e.target.value)} /></Field>
            </div>
            <Field label="Image"><UploadField kind="image" value={data.aboutPreviewImage} onChange={(v) => set('aboutPreviewImage', v)} /></Field>
          </div>
        </Card>
      </form>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
