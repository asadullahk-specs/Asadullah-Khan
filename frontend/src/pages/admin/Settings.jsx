import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api.js'
import { PageHeader, Card, Field, Input, Button, Toast, Spinner } from '../../components/admin/ui.jsx'

const emptySite = {
  siteName: '',
  siteTagline: '',
  seoDescription: '',
  favicon: '',
  adminEmail: '',
}

export default function Settings() {
  const [site, setSite] = useState(emptySite)
  const [loading, setLoading] = useState(true)
  const [savingSite, setSavingSite] = useState(false)
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPass, setSavingPass] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => { if (data?.data) setSite((s) => ({ ...s, ...data.data })) })
      .catch(() => setToast({ message: 'Could not load site settings.', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const setSiteField = (k, v) => setSite({ ...site, [k]: v })

  const saveSite = async (e) => {
    e.preventDefault()
    setSavingSite(true)
    try {
      await api.put('/settings', site)
      setToast({ message: 'Site settings saved.', type: 'success' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to save.', type: 'error' })
    } finally {
      setSavingSite(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  const savePass = async (e) => {
    e.preventDefault()
    if (pass.newPassword !== pass.confirmPassword) {
      setToast({ message: 'New passwords do not match.', type: 'error' })
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
      return
    }
    setSavingPass(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: pass.currentPassword,
        newPassword: pass.newPassword,
      })
      setToast({ message: 'Password updated.', type: 'success' })
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to update password.', type: 'error' })
    } finally {
      setSavingPass(false)
      setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
    }
  }

  if (loading) return <Spinner label="Loading settings…" />

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide settings and account security." />
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveSite}>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Site</h3>
            <Field label="Site Name"><Input value={site.siteName} onChange={(e) => setSiteField('siteName', e.target.value)} /></Field>
            <Field label="Tagline"><Input value={site.siteTagline} onChange={(e) => setSiteField('siteTagline', e.target.value)} /></Field>
            <Field label="SEO Description"><Input value={site.seoDescription} onChange={(e) => setSiteField('seoDescription', e.target.value)} /></Field>
            <Field label="Favicon URL"><Input value={site.favicon} onChange={(e) => setSiteField('favicon', e.target.value)} /></Field>
            <Field label="Admin Email" hint="Informational contact email only — does not change your login email.">
              <Input type="email" value={site.adminEmail} onChange={(e) => setSiteField('adminEmail', e.target.value)} />
            </Field>
            <Button type="submit" disabled={savingSite}><Save size={16} /> {savingSite ? 'Saving…' : 'Save Site Settings'}</Button>
          </Card>
        </form>
        <form onSubmit={savePass}>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
            <Field label="Current Password">
              <Input type="password" value={pass.currentPassword} onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })} required />
            </Field>
            <Field label="New Password">
              <Input type="password" value={pass.newPassword} onChange={(e) => setPass({ ...pass, newPassword: e.target.value })} required minLength={6} />
            </Field>
            <Field label="Confirm New Password">
              <Input type="password" value={pass.confirmPassword} onChange={(e) => setPass({ ...pass, confirmPassword: e.target.value })} required minLength={6} />
            </Field>
            <Button type="submit" disabled={savingPass}><Save size={16} /> {savingPass ? 'Updating…' : 'Update Password'}</Button>
          </Card>
        </form>
      </div>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
