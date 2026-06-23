import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// `aboutPreview` is passed down from Home.jsx (sourced from GET /api/hero,
// which also stores the Home "About Preview" fields).
export default function AboutPreview({ aboutPreview }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* IMAGE CONTAINER — fixed square, centered */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-2 md:order-1 flex justify-center"
        >
          <div className="w-full aspect-square sm:w-80 sm:h-80 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-xl overflow-hidden shadow-xl flex-shrink-0">
            <img
              src={aboutPreview.aboutPreviewImage} alt="About preview"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* TEXT CONTENT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-1 md:order-2 flex flex-col justify-center text-left"
        >
          <h2 className="heading text-3xl sm:text-4xl mb-4">{aboutPreview.aboutPreviewHeading}</h2>
          <p className="mb-6 text-justify">{aboutPreview.aboutPreviewText}</p>

          {/* DESKTOP-ONLY WRAPPER */}
          <div className="hidden md:block">
            <Link to="/about" className="btn-primary inline-flex items-center gap-2 w-fit">
              Read More <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* MOBILE-ONLY BUTTON */}
      <div className="mt-8 md:hidden flex justify-start">
        <Link to="/about" className="btn-primary inline-flex items-center gap-2 w-fit">
          Read More <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}