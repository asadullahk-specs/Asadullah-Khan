import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// `aboutPreview` is passed down from Home.jsx (sourced from GET /api/hero,
// which also stores the Home "About Preview" fields).
//
// Layout behaviour:
//  - md+ : image left / content right, and the image stretches to match
//    whichever column ends up taller (so it scales with the text length).
//  - <768px: content first (top), image second (below).
export default function AboutPreview({ aboutPreview }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        <motion.img
          src={aboutPreview.aboutPreviewImage} alt="About preview"
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-2 md:order-1 rounded-lg shadow-xl w-full object-cover h-64 md:h-full md:min-h-[320px]"
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-1 md:order-2 flex flex-col justify-center text-center md:text-left"
        >
          <h2 className="heading text-3xl sm:text-4xl mb-4">{aboutPreview.aboutPreviewHeading}</h2>
          <p className="mb-6">{aboutPreview.aboutPreviewText}</p>
          <Link to="/about" className="btn-primary mx-auto md:mx-0 w-fit">Read More <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  )
}