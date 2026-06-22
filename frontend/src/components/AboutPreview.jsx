import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// `aboutPreview` is passed down from Home.jsx (sourced from GET /api/hero,
// which also stores the Home "About Preview" fields).
export default function AboutPreview({ aboutPreview }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-stretch">

        {/* IMAGE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-2 md:order-1 flex flex-col"
        >
          <img
            src={aboutPreview.aboutPreviewImage} alt="About preview"
            className="rounded-lg shadow-xl w-full object-cover h-64 md:h-full md:min-h-[320px] flex-1"
          />
        </motion.div>

        {/* TEXT CONTENT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="order-1 md:order-2 flex flex-col justify-center text-left"
        >
          <h2 className="heading text-3xl sm:text-4xl mb-4">{aboutPreview.aboutPreviewHeading}</h2>
          <p className="mb-6">{aboutPreview.aboutPreviewText}</p>

          {/* DESKTOP-ONLY WRAPPER (Guarantees the button hides on mobile) */}
          <div className="hidden md:block">
            <Link to="/about" className="btn-primary inline-flex items-center gap-2 w-fit">
              Read More <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* MOBILE-ONLY BUTTON (Shows only below the image when screen < 768px) */}
      <div className="mt-8 md:hidden flex justify-start">
        <Link to="/about" className="btn-primary inline-flex items-center gap-2 w-fit">
          Read More <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}