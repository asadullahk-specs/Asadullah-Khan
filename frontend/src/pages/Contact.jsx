import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github, Send } from 'lucide-react'
import api from '../services/api.js'
import { contact as contactFallback } from '../data/dummy.js'

export default function Contact() {
  const [contact, setContact] = useState(contactFallback)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let mounted = true
    api.get('/contact-settings')
      .then(({ data }) => { if (mounted && data?.data) setContact({ ...contactFallback, ...data.data }) })
      .catch(() => { /* keep fallback */ })
    return () => { mounted = false }
  }, [])

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.post('/messages', form)
      setSent(true)
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong sending your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="heading text-3xl sm:text-4xl mb-3">Get In Touch</h1>
        <p className="max-w-2xl mx-auto">{contact.contactSubtitle}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h2 className="heading text-2xl mb-2">Let's talk about your project</h2>
            <p>{contact.availabilityText}</p>
          </div>
          {[
            { icon: Mail, label: 'Email', value: contact.adminEmail, href: `mailto:${contact.adminEmail}` },
            { icon: Phone, label: 'Phone', value: contact.adminPhone, href: `tel:${contact.adminPhone}` },
            { icon: MapPin, label: 'Location', value: contact.adminLocation },
          ].map(({ icon: I, label, value, href }) => (
            <a key={label} href={href || '#'} className="card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform block">
              <div className="p-3 rounded-lg bg-accent/10 text-accent"><I size={20} /></div>
              <div>
                <div className="text-xs">{label}</div>
                <div className="heading text-base">{value}</div>
              </div>
            </a>
          ))}
          <div className="flex gap-3">
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><Linkedin size={20} /></a>
            <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><Github size={20} /></a>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={submit} className="card p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First Name" placeholder="First Name" value={form.firstName} onChange={update('firstName')} required />
            <Field label="Last Name" placeholder="Last Name" value={form.lastName} onChange={update('lastName')} required />
          </div>
          <Field label="Email" placeholder="Email" type="email" value={form.email} onChange={update('email')} required />
          <Field label="Phone" placeholder="Phone" value={form.phone} onChange={update('phone')} />
          <div>
            <label className="block text-sm mb-1 heading">Message</label>
            <textarea placeholder="Message" required rows={5} value={form.message} onChange={update('message')}
              className="w-full px-4 py-2.5 rounded-xl bg-lightBg dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-accent focus:outline-none resize-none" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-60">
            <Send size={16} /> {sending ? 'Sending…' : 'Send Message'}
          </button>
          {sent && <p className="text-sm text-accent text-center">Thanks — your message has been sent!</p>}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </motion.form>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1 heading">{label}</label>
      <input {...props}
        className="w-full px-4 py-2.5 rounded-xl bg-lightBg dark:bg-darkBg border border-gray-200 dark:border-gray-700 focus:border-accent focus:outline-none" />
    </div>
  )
}