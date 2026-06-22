import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react'
import api from '../services/api.js'
import { footer as footerFallback, contact as contactFallback } from '../data/dummy.js'

const defaultJoinUs = [
  { label: 'LinkedIn', url: contactFallback.linkedinUrl },
  { label: 'GitHub', url: contactFallback.githubUrl },
  { label: 'Email', url: `mailto:${contactFallback.adminEmail}` },
]

export default function Footer() {
  const [footer, setFooter] = useState({ ...footerFallback, joinUsLinks: defaultJoinUs })
  const [contact, setContact] = useState(contactFallback)

  useEffect(() => {
    let mounted = true
    api.get('/footer')
      .then(({ data }) => {
        if (!mounted || !data?.data) return
        const f = data.data
        setFooter({
          footerSummaryText: f.footerSummaryText || footerFallback.footerSummaryText,
          footerSkillsList: f.footerSkillsList?.length ? f.footerSkillsList : footerFallback.footerSkillsList,
          joinUsLinks: f.joinUsLinks?.length ? f.joinUsLinks : defaultJoinUs,
        })
      })
      .catch(() => { /* keep fallback */ })
    api.get('/contact-settings')
      .then(({ data }) => { if (mounted && data?.data) setContact({ ...contactFallback, ...data.data }) })
      .catch(() => { /* keep fallback */ })
    return () => { mounted = false }
  }, [])

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-lightCard dark:bg-darkSecondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y divide-gray-200 dark:divide-gray-800 md:divide-y-0">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="heading text-lg mb-3">MY PORTFOLIO</h3>
          <p className="text-sm mb-4">{footer.footerSummaryText}</p>
          {footer.footerSkillsList?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 justify-center md:justify-start">
              {footer.footerSkillsList.map(s => (
                <span key={s} className="text-[10px] px-2 py-1 rounded-lg bg-accent/10 text-accent">{s}</span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><Linkedin size={18} /></a>
            <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"><Github size={18} /></a>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0">
          <h3 className="heading text-sm mb-3 tracking-wider">QUICK LINKS</h3>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/contact', 'Contact']].map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-accent">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0">
          <h3 className="heading text-sm mb-3 tracking-wider">JOIN US</h3>
          <ul className="space-y-2 text-sm">
            {footer.joinUsLinks.map((l) => (
              <li key={l.label}><a href={l.url} target="_blank" rel="noreferrer" className="hover:text-accent">{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0">
          <h3 className="heading text-sm mb-3 tracking-wider">CONTACT</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 justify-center md:justify-start"><Phone size={14} className="text-accent shrink-0" /> {contact.adminPhone}</li>
            <li className="flex items-center gap-2 justify-center md:justify-start"><Mail size={14} className="text-accent shrink-0" /> {contact.adminEmail}</li>
            <li className="flex items-center gap-2 justify-center md:justify-start"><MapPin size={14} className="text-accent shrink-0" /> {contact.adminLocation}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs">
        © 2026 Asadullah Khan. All rights reserved.
      </div>
    </footer>
  )
}