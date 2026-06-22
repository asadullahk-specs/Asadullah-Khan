import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import api from '../services/api.js'
import { certifications as certificationsFallback } from '../data/dummy.js'

export default function CertificationsCarousel() {
  const [i, setI] = useState(0)
  const [certifications, setCertifications] = useState(certificationsFallback)

  useEffect(() => {
    let active = true
    api.get('/certifications')
      .then(({ data }) => {
        if (!active) return
        if (data?.data?.length) setCertifications(data.data)
      })
      .catch(() => { /* keep fallback */ })
    return () => { active = false }
  }, [])

  const total = certifications.length
  if (total === 0) return null

  const c = certifications[i % total]
  const prev = () => setI((i - 1 + total) % total)
  const next = () => setI((i + 1) % total)

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
                <a href={c.pdfDocument} target="_blank" rel="noreferrer" className="btn-outline">
                  <FileText size={16} /> View PDF
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} aria-label="Previous certification" className="p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><ChevronLeft size={20} /></button>
          <div className="flex gap-2">
            {certifications.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full transition ${idx === i ? 'bg-accent w-6' : 'bg-accent/30'}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Next certification" className="p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  )
}