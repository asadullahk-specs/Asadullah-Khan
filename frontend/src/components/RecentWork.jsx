import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import ProjectCard from './ProjectCard.jsx'

export default function RecentWork() {
  const [recent, setRecent] = useState([]) // empty until backend responds
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/projects', { params: { recent: true } })
      .then(({ data }) => {
        if (!active) return
        if (data?.data?.length) setRecent(data.data.slice(0, 1))
      })
      .catch(() => { /* backend offline — stay hidden */ })
      .finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  // Only render once we've tried the backend AND have real projects
  if (!loaded || !recent.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="heading text-3xl sm:text-4xl mb-10 text-center">Recent Work</h2>
      <div className="grid place-items-center">
        <div className="w-full max-w-2xl">
          {recent.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      </div>
      <div className="text-center mt-10">
        <Link to="/projects" className="btn-primary">View All Projects</Link>
      </div>
    </section>
  )
}