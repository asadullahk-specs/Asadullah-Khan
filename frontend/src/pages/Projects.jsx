import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import api from '../services/api.js'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Projects() {
  const [active, setActive] = useState('All Projects')
  const [filterOpen, setFilterOpen] = useState(false)
  const [projects, setProjects] = useState([])        // empty until backend
  const [introText, setIntroText] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    api.get('/projects')
      .then(({ data }) => { if (mounted && data?.data?.length) setProjects(data.data) })
      .catch(() => { /* backend offline */ })
      .finally(() => { if (mounted) setLoaded(true) })
    api.get('/projects/page-settings')
      .then(({ data }) => {
        if (mounted && data?.data?.projectsPageIntroText) {
          setIntroText(data.data.projectsPageIntroText)
        }
      })
      .catch(() => { /* keep empty */ })
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => {
    const map = new Map()
    projects.forEach(p => map.set(p.projectCategory, (map.get(p.projectCategory) || 0) + 1))
    return [{ name: 'All Projects', count: projects.length }, ...Array.from(map, ([name, count]) => ({ name, count }))]
  }, [projects])

  const filtered = active === 'All Projects' ? projects : projects.filter(p => p.projectCategory === active)

  const Sidebar = ({ onSelect }) => (
    <aside className="w-full">
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal size={18} className="text-accent" />
        <h3 className="heading text-lg">Filter Projects</h3>
      </div>
      <p className="text-xs mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">{projects.length} projects total</p>
      <ul className="space-y-1">
        {categories.map(c => (
          <li key={c.name}>
            <button
              onClick={() => { setActive(c.name); onSelect?.() }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${active === c.name ? 'bg-accent text-white font-medium' : 'hover:bg-accent/10 hover:text-accent'}`}
            >
              <span>{c.name}</span>
              <span className={`text-xs ${active === c.name ? 'text-white/80' : 'text-accent'}`}>{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )

  if (!loaded || projects.length === 0) return null

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="heading text-3xl sm:text-4xl mb-3">My Projects</h1>
        <p className="mb-2 text-justify">{introText}</p>
        <p className="text-sm text-accent">Showing {filtered.length} of {projects.length} projects</p>
      </div>

      <button onClick={() => setFilterOpen(true)} className="lg:hidden btn-outline mb-6"><Filter size={16} /> Filter</button>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className="hidden lg:block bg-gray-50 dark:bg-darkSecondary rounded-lg border border-gray-200 dark:border-gray-800 p-6 h-fit sticky top-20">
          <Sidebar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 h-full w-[82%] max-w-80 bg-lightCard dark:bg-darkSecondary z-50 p-6 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold heading text-lg">Filters</span>
                <button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="p-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent"><X size={20} /></button>
              </div>
              <Sidebar onSelect={() => setFilterOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}