import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import api from '../services/api.js'
import { projects as projectsFallback, projectsPage as projectsPageFallback } from '../data/dummy.js'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Projects() {
  const [active, setActive] = useState('All Projects')
  const [filterOpen, setFilterOpen] = useState(false)
  const [projects, setProjects] = useState(projectsFallback)
  const [projectsPage, setProjectsPage] = useState(projectsPageFallback)

  useEffect(() => {
    let mounted = true
    api.get('/projects')
      .then(({ data }) => { if (mounted && data?.data?.length) setProjects(data.data) })
      .catch(() => { /* keep fallback */ })
    api.get('/projects/page-settings')
      .then(({ data }) => {
        if (mounted && data?.data?.projectsPageIntroText) {
          setProjectsPage({ projectsPageIntroText: data.data.projectsPageIntroText })
        }
      })
      .catch(() => { /* keep fallback */ })
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
      <h3 className="heading text-lg mb-1">Filter Projects</h3>
      <p className="text-xs mb-4">{projects.length} projects total</p>
      <ul className="space-y-1">
        {categories.map(c => (
          <li key={c.name}>
            <button
              onClick={() => { setActive(c.name); onSelect?.() }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${active === c.name ? 'bg-accent text-white' : 'hover:bg-accent/10 hover:text-accent'}`}
            >
              <span>{c.name}</span>
              <span className={`text-xs ${active === c.name ? 'text-white/80' : 'text-accent'}`}>{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="heading text-3xl sm:text-4xl mb-3">My Projects</h1>
        <p className="max-w-2xl mb-2">{projectsPage.projectsPageIntroText}</p>
        <p className="text-sm text-accent">Showing {filtered.length} of {projects.length} projects</p>
      </div>

      <button onClick={() => setFilterOpen(true)} className="lg:hidden btn-outline mb-6"><Filter size={16} /> Filter</button>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <div className="hidden lg:block card p-5 h-fit sticky top-20"><Sidebar /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="fixed top-0 left-0 h-full w-72 bg-lightCard dark:bg-darkCard z-50 p-6 lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold heading">Filters</span>
                <button onClick={() => setFilterOpen(false)} className="p-2 rounded-lg text-accent"><X size={20} /></button>
              </div>
              <Sidebar onSelect={() => setFilterOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
