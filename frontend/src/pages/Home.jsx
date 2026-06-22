import { useEffect, useState } from 'react'
import api from '../services/api.js'
import Hero from '../components/Hero.jsx'
import AboutPreview from '../components/AboutPreview.jsx'
import RecentWork from '../components/RecentWork.jsx'
import { hero as heroFallback, aboutPreview as aboutPreviewFallback } from '../data/dummy.js'

export default function Home() {
  // Render instantly with fallback content, then hydrate from the backend.
  const [hero, setHero] = useState(heroFallback)
  const [aboutPreview, setAboutPreview] = useState(aboutPreviewFallback)

  useEffect(() => {
    let active = true
    api.get('/hero')
      .then(({ data }) => {
        if (!active || !data?.data) return
        const h = data.data
        setHero({
          staticHeading: h.staticHeading || heroFallback.staticHeading,
          typewriterTexts: h.typewriterTexts?.length ? h.typewriterTexts : heroFallback.typewriterTexts,
          paragraphText: h.paragraphText || heroFallback.paragraphText,
          skills: h.skills?.length ? h.skills : heroFallback.skills,
          heroImage: h.heroImage || heroFallback.heroImage,
          cvDoc: h.cvDoc || heroFallback.cvDoc,
        })
        setAboutPreview({
          aboutPreviewHeading: h.aboutPreviewHeading || aboutPreviewFallback.aboutPreviewHeading,
          aboutPreviewText: h.aboutPreviewText || aboutPreviewFallback.aboutPreviewText,
          aboutPreviewImage: h.aboutPreviewImage || aboutPreviewFallback.aboutPreviewImage,
        })
      })
      .catch(() => { /* keep fallback content visible */ })
    return () => { active = false }
  }, [])

  return (<>
    <Hero hero={hero} />
    <AboutPreview aboutPreview={aboutPreview} />
    <RecentWork />
  </>)
}
