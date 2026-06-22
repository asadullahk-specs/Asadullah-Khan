import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function ProjectCard({ p, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="card overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={p.projectImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {p.projectCategory && <span className="absolute top-3 left-3 tag bg-accent text-white">{p.projectCategory}</span>}
      </div>
      <div className="p-5">
        <h3 className="heading text-lg mb-2">{p.title}</h3>
        <p className="text-sm mb-4 line-clamp-2">{p.description}</p>
        {p.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.technologies.map(t => <span key={t} className="tag text-[10px]">{t}</span>)}
          </div>
        )}
        <a href={p.detailsLink} className="text-accent text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
          View Details <ExternalLink size={14} />
        </a>
      </div>
    </motion.article>
  )
}
