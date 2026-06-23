import { useEffect, useState } from 'react'
import api from '../services/api.js'
import Hero from '../components/Hero.jsx'
import AboutPreview from '../components/AboutPreview.jsx'
import RecentWork from '../components/RecentWork.jsx'

export default function Home() {
  // null = not yet attempted; false = failed/empty; object = loaded
  const [hero, setHero] = useState(null)
  const [aboutPreview, setAboutPreview] = useState(null)

  useEffect(() => {
    let active = true
    api.get('/hero')
      .then(({ data }) => {
        if (!active || !data?.data) return
        const h = data.data
        // Only set if backend actually returned content
        if (h.staticHeading || h.heroImage) {
          setHero({
            staticHeading: h.staticHeading || '',
            typewriterTexts: h.typewriterTexts?.length ? h.typewriterTexts : [],
            paragraphText: h.paragraphText || '',
            skills: h.skills?.length ? h.skills : [],
            heroImage: h.heroImage || '',
            cvDoc: h.cvDoc || '#',
          })
          setAboutPreview({
            aboutPreviewHeading: h.aboutPreviewHeading || '',
            aboutPreviewText: h.aboutPreviewText || '',
            aboutPreviewImage: h.aboutPreviewImage || '',
          })
        }
      })
      .catch(() => { /* backend offline — nothing shown */ })
    return () => { active = false }
  }, [])

  return (<>
    {hero && <Hero hero={hero} />}
    {aboutPreview && <AboutPreview aboutPreview={aboutPreview} />}
    <RecentWork />
  </>)
}
