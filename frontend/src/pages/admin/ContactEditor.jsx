import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api.js'
import { contact as contactFallback } from '../../data/dummy.js'
import { PageHeader, Card, Field, Input, Textarea, Button, Toast, Spinner } from '../../components/admin/ui.jsx'

export default function ContactEditor() {
  const [data, setData] = useState(contactFallback)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/contact-settings')
      .then(({ data: res }) => { if (res?.data) setData((d) => ({ ...d, ...res.data })) })
      .catch(() => setToast({ message: 'Could not load contact settings — showing defaults.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setData({ ...data, [k]: v })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/contact-settings', data)
      setToast({ message: 'Contact settings saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading contact settings…" />

  return (
    <div>
      <PageHeader title="Contact" subtitle="Edit contact info and social links shown on the Contact page." />
      <form onSubmit={save}>
        <Card className="mb-6">
          <Field label="Subtitle"><Textarea rows={2} value={data.contactSubtitle} onChange={(e) => set('contactSubtitle', e.target.value)} /></Field>
          <Field label="Availability Text"><Textarea rows={2} value={data.availabilityText} onChange={(e) => set('availabilityText', e.target.value)} /></Field>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Email"><Input type="email" value={data.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} /></Field>
            <Field label="Phone"><Input value={data.adminPhone} onChange={(e) => set('adminPhone', e.target.value)} /></Field>
            <Field label="Location"><Input value={data.adminLocation} onChange={(e) => set('adminLocation', e.target.value)} /></Field>
            <Field label="LinkedIn URL"><Input value={data.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} /></Field>
            <Field label="GitHub URL"><Input value={data.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} /></Field>
          </div>
        </Card>
        <Button type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
