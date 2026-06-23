import { useState } from 'react'
import { Link2, CheckCircle2, XCircle } from 'lucide-react'

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

// Converts a Google Drive share link into a direct-access URL.
// Supports both /file/d/FILE_ID/... and ?id=FILE_ID formats.
// For images we use the thumbnail endpoint; for docs we use the export/preview endpoint.
function parseDriveLink(raw, kind) {
  if (!raw) return raw
  // Already a direct drive URL — return as-is
  if (/drive\.google\.com\/uc\?/.test(raw) || /drive\.google\.com\/thumbnail/.test(raw)) return raw
  // Extract file ID from share URL
  const idMatch =
    raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    raw.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (!idMatch) return raw // not a Drive link — pass through unchanged
  const id = idMatch[1]
  if (kind === 'image') {
    // Use thumbnail proxy — works publicly when file is shared as "Anyone with the link"
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800`
  }
  // Documents: use the viewer link
  return `https://drive.google.com/file/d/${id}/view`
}

function isDriveLink(url) {
  return /drive\.google\.com/.test(url || '')
}

function isValidDriveDomain(url) {
  if (!url) return null // empty = neutral
  if (isDriveLink(url)) return true
  // Allow other plain URLs (http/https)
  return /^https?:\/\//.test(url) ? true : false
}

// UploadField — accepts a Google Drive sharing link (or any HTTPS URL).
// When a Drive link is detected it is automatically converted to a
// direct-access URL suitable for <img> tags or download links.
// Hint text and a status badge guide the user.
export function UploadField({ value, onChange, kind = 'image', placeholder }) {
  const [localInput, setLocalInput] = useState(value || '')
  const [error, setError] = useState('')

  const commit = (raw) => {
    setError('')
    const cleaned = raw.trim()
    if (!cleaned) { onChange(''); return }
    if (isDriveLink(cleaned)) {
      const converted = parseDriveLink(cleaned, kind)
      onChange(converted)
    } else if (/^https?:\/\//.test(cleaned)) {
      onChange(cleaned)
    } else {
      setError('Please paste a valid Google Drive link or an HTTPS URL.')
    }
  }

  const handleChange = (e) => {
    setLocalInput(e.target.value)
    if (!e.target.value.trim()) { onChange(''); setError('') }
  }

  const handleBlur = () => commit(localInput)
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text')
    setLocalInput(pasted)
    setTimeout(() => commit(pasted), 0)
  }

  // Sync if parent changes value externally
  const displayValue = value || ''
  const valid = isValidDriveDomain(displayValue)
  const showThumb = kind === 'image' && displayValue && valid
  const showDocLink = kind !== 'image' && displayValue && valid

  return (
    <div>
      {/* Hint banner */}
      <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500 dark:text-gray-400">
        <Link2 size={12} className="shrink-0 text-accent" />
        <span>Paste a <strong className="text-gray-700 dark:text-gray-300">Google Drive sharing link</strong> — make sure the file is shared as &quot;Anyone with the link&quot;.</span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          value={localInput}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={placeholder || (kind === 'image'
            ? 'Paste Google Drive image link…'
            : 'Paste Google Drive PDF/DOC link…'
          )}
        />
        {displayValue && valid !== null && (
          <span className="shrink-0">
            {valid
              ? <CheckCircle2 size={18} className="text-green-500" />
              : <XCircle size={18} className="text-red-500" />}
          </span>
        )}
      </div>
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
      {showThumb && (
        <img
          src={displayValue}
          alt="preview"
          className="mt-2 h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      {showDocLink && (
        <a href={displayValue} target="_blank" rel="noreferrer" className="inline-block mt-1.5 text-xs text-accent hover:underline">
          View / Download file →
        </a>
      )}
    </div>
  )
}
