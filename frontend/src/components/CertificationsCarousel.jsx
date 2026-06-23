import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import api from '../services/api.js'

export default function CertificationsCarousel() {
  const [idx, setIdx] = useState(0)
  const [certifications, setCertifications] = useState(null) // null = not loaded yet
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/certifications')
      .then(({ data }) => {
        if (!active) return
        if (data?.data?.length) setCertifications(data.data)
      })
      .catch(() => { /* backend offline — stay hidden */ })
      .finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  // Only render once we've tried the backend AND have real data
  if (!loaded || !certifications?.length) return null

  const total = certifications.length
  const c = certifications[idx % total]
  const prev = () => setIdx((idx - 1 + total) % total)
  const next = () => setIdx((idx + 1) % total)

  const getPdfViewerUrl = (url) => {
    if (!url) return '#'
    // If it's a google drive download link, convert it to view link
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (match && /drive\.google\.com/.test(url)) {
      return `https://drive.google.com/file/d/${match[1]}/view`
    }
    return url
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="heading text-3xl sm:text-4xl text-center mb-10 tracking-wider">CERTIFICATIONS</h2>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={c.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="card overflow-hidden"
          >
            <img src={c.certificateImage} alt={c.title} className="w-full h-64 sm:h-80 object-cover" />
            <div className="p-6">
              <h3 className="heading text-xl mb-2 text-left">{c.title}</h3>
              <p className="text-accent text-sm font-medium mb-2 text-left">{c.issuer}</p>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs">{c.duration}</p>
                {/* Opens PDF in a new tab — no download attribute */}
                <a href={getPdfViewerUrl(c.pdfDocument)} target="_blank" rel="noreferrer" className="btn-outline">
                  <FileText size={16} /> View PDF
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} aria-label="Previous certification" className="p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><ChevronLeft size={20} /></button>
          <div className="flex gap-2">
            {certifications.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === idx ? 'bg-accent w-6' : 'bg-accent/30'}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Next certification" className="p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  )
}