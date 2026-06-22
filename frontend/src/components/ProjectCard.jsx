import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function ProjectCard({ p, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="card overflow-hidden group flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden shrink-0">
        <img src={p.projectImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="heading text-xl mb-2">{p.title}</h3>
        <p className="text-sm mb-4 line-clamp-2">{p.description}</p>
        {p.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.technologies.map(t => <span key={t} className="tag text-[10px]">{t}</span>)}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <a href={p.detailsLink} className="text-accent text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
            View Details <ExternalLink size={14} />
          </a>
          {p.projectCategory && <span className="tag whitespace-nowrap">{p.projectCategory}</span>}
        </div>
      </div>
    </motion.article>
  )
}