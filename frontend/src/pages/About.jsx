import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import api from '../services/api.js'
import { aboutPage as aboutPageFallback } from '../data/dummy.js'
import SkillsAccordion from '../components/SkillsAccordion.jsx'
import CertificationsCarousel from '../components/CertificationsCarousel.jsx'

export default function About() {
  const [aboutPage, setAboutPage] = useState(aboutPageFallback)

  useEffect(() => {
    let active = true
    api.get('/about')
      .then(({ data }) => {
        if (!active || !data?.data) return
        const a = data.data
        setAboutPage({
          aboutPageParagraphs: a.aboutPageParagraphs?.length ? a.aboutPageParagraphs : aboutPageFallback.aboutPageParagraphs,
          aboutPageSkills: a.aboutPageSkills?.length ? a.aboutPageSkills : aboutPageFallback.aboutPageSkills,
          cvAttachmentUrl: a.cvAttachmentUrl || aboutPageFallback.cvAttachmentUrl,
        })
      })
      .catch(() => { /* keep fallback */ })
    return () => { active = false }
  }, [])

  return (
    <div className="py-12">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-10">
          <h1 className="heading text-3xl sm:text-4xl mb-6">About Me</h1>
          <div className="space-y-4 mb-6">
            {aboutPage.aboutPageParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {aboutPage.aboutPageSkills.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
          <a href={aboutPage.cvAttachmentUrl} download className="btn-primary"><Download size={16} /> Download CV</a>
        </div>
      </section>
      <SkillsAccordion />
      <CertificationsCarousel />
    </div>
  )
}
