import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// `aboutPreview` is passed down from Home.jsx (sourced from GET /api/hero,
// which also stores the Home "About Preview" fields).
export default function AboutPreview({ aboutPreview }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.img
          src={aboutPreview.aboutPreviewImage} alt="About preview"
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-2xl shadow-xl w-full object-cover h-80"
        />
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="heading text-3xl sm:text-4xl mb-4">{aboutPreview.aboutPreviewHeading}</h2>
          <p className="mb-6">{aboutPreview.aboutPreviewText}</p>
          <Link to="/about" className="btn-primary">Read More <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  )
}
