import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import useTypewriter from '../hooks/useTypewriter.js'

const menuItems = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const text = useTypewriter(['Asadullah Khan', 'Personal Portfolio'])

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-lightBg/80 dark:bg-darkBg/80 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg sm:text-xl font-bold heading inline-block min-w-[220px] sm:min-w-[260px]">
          <span className="cursor text-accent">{text}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-accent' : 'hover:text-accent'}`}>Home</NavLink>
          <div className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
            <button onClick={() => setMenuOpen(v => !v)} className="text-sm font-medium hover:text-accent inline-flex items-center gap-1">
              Menu <ChevronDown size={16} className={`transition ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-3 w-44 card p-2 border border-gray-100 dark:border-gray-700"
                >
                  {menuItems.map(item => (
                    <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                      className={({isActive}) => `block px-3 py-2 rounded-lg text-sm ${isActive ? 'text-accent bg-accent/10' : 'hover:bg-accent/10 hover:text-accent'}`}>
                      {item.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-lg hover:bg-accent/10 text-accent">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="md:hidden p-2 rounded-lg hover:bg-accent/10 text-accent">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-lightCard dark:bg-darkCard z-50 p-6 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold heading">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-accent/10 text-accent"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-2">
                {[{to:'/',label:'Home'}, ...menuItems].map(item => (
                  <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                    className={({isActive}) => `px-3 py-2 rounded-lg ${isActive ? 'text-accent bg-accent/10' : 'hover:bg-accent/10 hover:text-accent'}`}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
