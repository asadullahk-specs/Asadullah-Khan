import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import useTypewriter from '../hooks/useTypewriter.js'

// `hero` is passed down from Home.jsx, which fetches it from GET /api/hero
// (falling back to src/data/dummy.js while loading or if the request fails).
//
// Layout behaviour:
//  - >=768px (md+): side-by-side, text left / image right.
//  - <768px: stacks with the image on top and centered text below.
//  - <480px (max-[480px]): buttons stack vertically with equal width.
export default function Hero({ hero }) {
  const typed = useTypewriter(hero.typewriterTexts)
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-8 md:gap-6 lg:gap-12 items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="order-2 md:order-1 text-center md:text-left"
      >
        <h1 className="heading text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl leading-tight mb-4">{hero.staticHeading}</h1>
        <div className="text-xl sm:text-2xl md:text-xl lg:text-3xl font-semibold text-accent mb-6 h-9 md:h-8 lg:h-10">
          <span className="cursor">{typed}</span>
        </div>
        <p className="text-base sm:text-lg md:text-base lg:text-lg mb-6 max-w-xl mx-auto md:mx-0 text-justify">{hero.paragraphText}</p>
        <div className="text-justify mb-8">
          {hero.skills.map(s => <span key={s} className="tag mr-2 mb-2">{s}</span>)}
        </div>
        {/* Buttons: stacked full-width below 480px, inline row above */}
        <div className="flex flex-row max-[480px]:flex-col gap-3 justify-center md:justify-start w-full sm:w-auto">
          <a href={hero.cvDoc} download className="btn-primary max-[480px]:w-full justify-center"><Download size={16} /> Download CV</a>
          <Link to="/contact" className="btn-outline max-[480px]:w-full justify-center"><Mail size={16} /> Contact Me</Link>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="order-1 md:order-2 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-accent to-accentHover rounded-full blur-2xl opacity-30" />
          <img
            src={hero.heroImage} alt="Asadullah Khan"
            className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-44 md:h-44 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover rounded-full border-4 border-accent shadow-2xl"
          />
        </div>
      </motion.div>
    </section>
  )
}