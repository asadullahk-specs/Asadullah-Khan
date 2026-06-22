import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import { projects as projectsFallback } from '../data/dummy.js'
import ProjectCard from './ProjectCard.jsx'

export default function RecentWork() {
  const [recent, setRecent] = useState(
    () => projectsFallback.filter(p => p.isRecent).slice(0, 1)
  )

  useEffect(() => {
    let active = true
    api.get('/projects', { params: { recent: true } })
      .then(({ data }) => {
        if (!active) return
        if (data?.data?.length) setRecent(data.data.slice(0, 1))
      })
      .catch(() => { /* keep fallback */ })
    return () => { active = false }
  }, [])

  if (!recent.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="heading text-3xl sm:text-4xl mb-10 text-center">Recent Work</h2>
      <div className="grid place-items-center">
        <div className="w-full max-w-md">
          {recent.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      </div>
      <div className="text-center mt-10">
        <Link to="/projects" className="btn-primary">View All Projects</Link>
      </div>
    </section>
  )
}
