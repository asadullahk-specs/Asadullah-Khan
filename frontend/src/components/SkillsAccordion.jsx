import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import api from '../services/api.js'

export default function SkillsAccordion() {
  const [open, setOpen] = useState(0)
  const [skillsSection, setSkillsSection] = useState(null) // null = not yet loaded
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/skills')
      .then(({ data }) => {
        if (!active || !data?.data) return
        const s = data.data
        if (s.skillsCategories?.length) {
          setSkillsSection({
            skillsIntroParagraph: s.skillsIntroParagraph || '',
            skillsCategories: s.skillsCategories,
          })
        }
      })
      .catch(() => { /* backend offline — stay hidden */ })
      .finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  // Only render once we've tried the backend AND have real data
  if (!loaded || !skillsSection) return null

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h2 className="heading text-3xl sm:text-4xl text-center mb-4 tracking-wider">SKILLS &amp; TECHNOLOGIES</h2>
      <p className="text-center max-w-2xl mx-auto mb-10 text-justify">{skillsSection.skillsIntroParagraph}</p>
      <div className="space-y-3">
        {skillsSection.skillsCategories.map((c, i) => {
          const isOpen = open === i
          return (
            <div key={c.id ?? c.categoryName} className="card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="heading">{c.categoryName}</span>
                <ChevronDown className={`text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5">
                      <p className="mb-3 text-sm text-justify">{c.categoryDescription}</p>
                      <div className="text-justify">
                        {c.subSkills.map(s => <span key={s} className="tag mr-2 mb-2">{s}</span>)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
