import { useEffect, useState } from 'react'
import { Link2, Trash2, Copy, Plus, CheckCircle2, ExternalLink } from 'lucide-react'
import { PageHeader, Card, Button, Toast, Spinner, Input } from '../../components/admin/ui.jsx'

// Convert a Google Drive share link to a direct-access URL.
function parseDriveLink(raw, kind = 'image') {
  if (!raw) return raw
  if (/drive\.google\.com\/uc\?/.test(raw) || /drive\.google\.com\/thumbnail/.test(raw)) return raw
  const idMatch =
    raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    raw.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (!idMatch) return raw
  const id = idMatch[1]
  if (kind === 'image') return `https://drive.google.com/thumbnail?id=${id}&sz=w800`
  return `https://drive.google.com/file/d/${id}/view`
}

function isDriveLink(url) {
  return /drive\.google\.com/.test(url || '')
}

function guessKind(name = '') {
  const n = name.toLowerCase()
  if (/\.(pdf|doc|docx)$/.test(n)) return 'document'
  return 'image'
}

const STORAGE_KEY = 'portfolio_drive_links'

function loadLinks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
}

export default function Uploads() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  // Form state for adding a new link
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newError, setNewError] = useState('')

  useEffect(() => {
    setLinks(loadLinks())
    setLoading(false)
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 2200)
  }

  const addLink = () => {
    setNewError('')
    const name = newName.trim()
    const url = newUrl.trim()
    if (!name) { setNewError('Please enter a name for this link.'); return }
    if (!url) { setNewError('Please paste a Google Drive link.'); return }
    if (!isDriveLink(url) && !/^https?:\/\//.test(url)) {
      setNewError('Please paste a valid Google Drive sharing link or HTTPS URL.')
      return
    }
    const kind = guessKind(name)
    const converted = isDriveLink(url) ? parseDriveLink(url, kind) : url
    const entry = { id: Date.now().toString(), name, url: converted, kind, addedAt: new Date().toISOString() }
    const next = [entry, ...links]
    setLinks(next)
    saveLinks(next)
    setNewName('')
    setNewUrl('')
    showToast('Link saved.')
  }

  const remove = (id) => {
    if (!confirm('Remove this link?')) return
    const next = links.filter((l) => l.id !== id)
    setLinks(next)
    saveLinks(next)
    showToast('Link removed.')
  }

  const copy = (url) => {
    navigator.clipboard.writeText(url)
    showToast('URL copied to clipboard.')
  }

  if (loading) return <Spinner label="Loading…" />

  return (
    <div>
      <PageHeader
        title="Drive Links"
        subtitle="Store Google Drive sharing links here and copy them into any editor field."
      />

      {/* Add new link */}
      <Card className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Link2 size={16} className="text-accent" /> Add Google Drive Link
        </h3>
        <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
          <CheckCircle2 size={13} className="shrink-0 text-accent" />
          <span>In Google Drive, open the file → Share → <strong className="text-gray-700 dark:text-gray-300">Anyone with the link</strong> → Copy link → paste it below.</span>
        </div>
        <div className="grid sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name / Label</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Hero Image, My CV…"
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Google Drive Sharing Link</label>
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/…"
              onPaste={(e) => {
                const p = e.clipboardData.getData('text')
                setNewUrl(p)
                e.preventDefault()
              }}
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
          </div>
          <Button onClick={addLink} className="shrink-0">
            <Plus size={15} /> Save Link
          </Button>
        </div>
        {newError && <p className="text-xs text-red-500 mt-2">{newError}</p>}
      </Card>

      {/* Saved links list */}
      <Card>
        {links.length === 0 ? (
          <div className="text-center py-12">
            <Link2 size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No Drive links saved yet.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first link above, then paste the copied URL into any editor field.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {links.map((l) => (
              <div key={l.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                {/* Thumbnail or icon */}
                <div className="h-11 w-11 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  {l.kind === 'image' ? (
                    <img
                      src={l.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <ExternalLink size={20} className="text-gray-400" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{l.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{l.url}</div>
                </div>
                {/* Actions */}
                <div className="flex gap-1.5 shrink-0">
                  <Button variant="secondary" className="!px-2.5 !py-1.5" onClick={() => copy(l.url)} title="Copy URL">
                    <Copy size={14} />
                  </Button>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    <Button variant="secondary" className="!px-2.5 !py-1.5" title="Open file">
                      <ExternalLink size={14} />
                    </Button>
                  </a>
                  <Button variant="danger" className="!px-2.5 !py-1.5" onClick={() => remove(l.id)} title="Remove">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
