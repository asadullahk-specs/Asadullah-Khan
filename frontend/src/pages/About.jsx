import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import api from '../services/api.js'
import SkillsAccordion from '../components/SkillsAccordion.jsx'
import CertificationsCarousel from '../components/CertificationsCarousel.jsx'

export default function About() {
  const [aboutPage, setAboutPage] = useState(null) // null = not loaded
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/about')
      .then(({ data }) => {
        if (!active || !data?.data) return
        const a = data.data
        if (a.aboutPageParagraphs?.length || a.aboutPageSkills?.length) {
          setAboutPage({
            aboutPageParagraphs: a.aboutPageParagraphs?.length ? a.aboutPageParagraphs : [],
            aboutPageSkills: a.aboutPageSkills?.length ? a.aboutPageSkills : [],
            cvAttachmentUrl: a.cvAttachmentUrl || '#',
          })
        }
      })
      .catch(() => { /* backend offline — nothing shown */ })
      .finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  return (
    <div>
      {loaded && aboutPage && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="card p-8 sm:p-10">
            <h1 className="heading text-3xl sm:text-4xl mb-6">About Me</h1>
            <div className="space-y-4 mb-6">
              {aboutPage.aboutPageParagraphs.map((p, i) => (
                <p key={i} className="text-justify">{p}</p>
              ))}
            </div>
            <div className="text-justify mb-8">
              {aboutPage.aboutPageSkills.map(s => <span key={s} className="tag mr-2 mb-2">{s}</span>)}
            </div>
            <a href={aboutPage.cvAttachmentUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <Download size={16} /> Download CV
            </a>
          </div>
        </section>
      )}
      <SkillsAccordion />
      <CertificationsCarousel />
    </div>
  )
}
