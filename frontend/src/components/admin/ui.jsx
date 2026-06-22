import { useRef, useState } from 'react'
import api from '../../services/api.js'

// Shared admin UI primitives — keep markup consistent across editors.
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-lightCard dark:bg-darkCard rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

const inputBase =
  'w-full px-3 py-2 rounded-lg bg-lightBg dark:bg-darkBg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent'

export function Input(props) {
  return <input {...props} className={`${inputBase} ${props.className || ''}`} />
}
export function Textarea(props) {
  return <textarea {...props} className={`${inputBase} resize-none ${props.className || ''}`} />
}
export function Select({ children, ...props }) {
  return <select {...props} className={`${inputBase} ${props.className || ''}`}>{children}</select>
}

export function Button({ variant = 'primary', children, className = '', ...props }) {
  const styles = {
    primary: 'bg-accent hover:bg-accentHover text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-gray-600 dark:text-gray-300 hover:text-accent',
  }
  return (
    <button {...props} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function TagInput({ value = [], onChange, placeholder = 'Add and press Enter' }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      onChange([...value, e.target.value.trim()])
      e.target.value = ''
    }
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs">
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-accentHover">×</button>
          </span>
        ))}
      </div>
      <Input onKeyDown={handleKey} placeholder={placeholder} />
    </div>
  )
}

export function Toast({ message, type = 'success' }) {
  if (!message) return null
  const color = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${color} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm`}>
      {message}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-10 justify-center">
      <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      {label}
    </div>
  )
}

// A URL text field paired with a real file-upload button. Typing a URL
// directly still works (e.g. pasting an external image link); clicking
// "Upload" picks a local file, sends it to POST /api/uploads, and fills
// the field with the URL the backend returns. `kind="image"` restricts
// the file picker to image types and shows a thumbnail preview.
export function UploadField({ value, onChange, kind = 'image', placeholder }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const accept = kind === 'image' ? 'image/*' : '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.data.url)
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const isImage = kind === 'image' && value && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value)

  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (kind === 'image' ? 'https://… or upload a file' : 'https://… or upload a PDF/DOC')}
        />
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
      {isImage && (
        <img src={value} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
      )}
      {kind !== 'image' && value && (
        <a href={value} target="_blank" rel="noreferrer" className="inline-block mt-1.5 text-xs text-accent hover:underline">
          View current file →
        </a>
      )}
    </div>
  )
}
