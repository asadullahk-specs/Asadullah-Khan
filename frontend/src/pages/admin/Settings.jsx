import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { PageHeader, Card, Field, Input, Button, Toast, Spinner } from '../../components/admin/ui.jsx'

const emptySite = {
  siteName: '',
  siteTagline: '',
  seoDescription: '',
  favicon: '',
  adminEmail: '',
}

export default function Settings() {
  const { user, updateUser } = useAuth()

  const [site, setSite] = useState(emptySite)
  const [loading, setLoading] = useState(true)
  const [savingSite, setSavingSite] = useState(false)

  // Change-password form
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPass, setSavingPass] = useState(false)

  // Change-email form
  const [emailForm, setEmailForm] = useState({ currentPassword: '', newEmail: '' })
  const [savingEmail, setSavingEmail] = useState(false)

  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => { if (data?.data) setSite((s) => ({ ...s, ...data.data })) })
      .catch(() => showToast('Could not load site settings.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const setSiteField = (k, v) => setSite({ ...site, [k]: v })

  // ── Save site settings ──────────────────────────────────────────────────────
  const saveSite = async (e) => {
    e.preventDefault()
    setSavingSite(true)
    try {
      await api.put('/settings', site)
      showToast('Site settings saved.')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save.', 'error')
    } finally {
      setSavingSite(false)
    }
  }

  // ── Change password ─────────────────────────────────────────────────────────
  const savePass = async (e) => {
    e.preventDefault()
    if (pass.newPassword !== pass.confirmPassword) {
      showToast('New passwords do not match.', 'error')
      return
    }
    setSavingPass(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: pass.currentPassword,
        newPassword: pass.newPassword,
      })
      showToast('Password updated successfully.')
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update password.', 'error')
    } finally {
      setSavingPass(false)
    }
  }

  // ── Change login email ──────────────────────────────────────────────────────
  const saveEmail = async (e) => {
    e.preventDefault()
    if (!emailForm.newEmail || !emailForm.currentPassword) {
      showToast('Both fields are required.', 'error')
      return
    }
    setSavingEmail(true)
    try {
      const { data } = await api.post('/auth/change-email', {
        currentPassword: emailForm.currentPassword,
        newEmail: emailForm.newEmail,
      })
      // Reflect the new email in the header without re-login
      if (data?.admin) updateUser({ email: data.admin.email })
      showToast('Login email updated successfully.')
      setEmailForm({ currentPassword: '', newEmail: '' })
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update email.', 'error')
    } finally {
      setSavingEmail(false)
    }
  }

  if (loading) return <Spinner label="Loading settings…" />

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide settings and account security." />

      {/* Row 1 – Site settings & Change Password */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <form onSubmit={saveSite}>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Site</h3>
            <Field label="Site Name"><Input value={site.siteName} onChange={(e) => setSiteField('siteName', e.target.value)} /></Field>
            <Field label="Tagline"><Input value={site.siteTagline} onChange={(e) => setSiteField('siteTagline', e.target.value)} /></Field>
            <Field label="SEO Description"><Input value={site.seoDescription} onChange={(e) => setSiteField('seoDescription', e.target.value)} /></Field>
            <Field label="Favicon URL"><Input value={site.favicon} onChange={(e) => setSiteField('favicon', e.target.value)} /></Field>
            <Field label="Contact Email" hint="Public contact email displayed on the site — separate from your admin login.">
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

      {/* Row 2 – Change Login Email */}
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveEmail}>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Change Login Email</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Current login email: <span className="font-medium text-gray-800 dark:text-gray-200">{user?.email}</span>
            </p>
            <Field label="Current Password" hint="Required to verify your identity before changing the email.">
              <Input
                type="password"
                value={emailForm.currentPassword}
                onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                required
              />
            </Field>
            <Field label="New Login Email">
              <Input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                required
                placeholder="new@example.com"
              />
            </Field>
            <Button type="submit" disabled={savingEmail}><Save size={16} /> {savingEmail ? 'Updating…' : 'Update Login Email'}</Button>
          </Card>
        </form>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
