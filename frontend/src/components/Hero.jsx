import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import useTypewriter from '../hooks/useTypewriter.js'

// `hero` is passed down from Home.jsx, which fetches it from GET /api/hero
// (falling back to src/data/dummy.js while loading or if the request fails).
export default function Hero({ hero }) {
  const typed = useTypewriter(hero.typewriterTexts)
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
        <h1 className="heading text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">{hero.staticHeading}</h1>
        <div className="text-2xl sm:text-3xl font-semibold text-accent mb-6 h-10">
          <span className="cursor">{typed}</span>
        </div>
        <p className="text-base sm:text-lg mb-6 max-w-xl">{hero.paragraphText}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {hero.skills.map(s => <span key={s} className="tag">{s}</span>)}
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={hero.cvDoc} download className="btn-primary"><Download size={16} /> Download CV</a>
          <Link to="/contact" className="btn-outline"><Mail size={16} /> Contact Me</Link>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="order-1 lg:order-2 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-accent to-accentHover rounded-full blur-2xl opacity-30" />
          <img src={hero.heroImage} alt="Asadullah Khan" className="relative w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-full border-4 border-accent shadow-2xl" />
        </div>
      </motion.div>
    </section>
  )
}
