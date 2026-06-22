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
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-lightCard/90 dark:bg-darkSecondary/90 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-lg sm:text-xl font-bold heading inline-block min-w-[180px] sm:min-w-[260px] shrink-0">
            <span className="cursor text-accent">{text}</span>
          </Link>

          {/* Right-hand cluster: desktop nav links + theme toggle + mobile hamburger, grouped together */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-6 sm:gap-8 mr-2">
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-accent' : 'hover:text-accent'}`}>Home</NavLink>
              <div className="relative">
                <button onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-haspopup="true" className="text-sm font-medium hover:text-accent inline-flex items-center gap-1">
                  Menu <ChevronDown size={16} className={`transition ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      {/* Click-away catcher so the dropdown only closes on an explicit click outside it, not on mouse-leave */}
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-3 w-44 card p-2 border border-gray-100 dark:border-gray-700 z-50"
                      >
                        {menuItems.map(item => (
                          <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                            className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm ${isActive ? 'text-accent bg-accent/10' : 'hover:bg-accent/10 hover:text-accent'}`}>
                            {item.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button onClick={toggle} aria-label="Toggle theme" className="p-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent shrink-0">
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-haspopup="true"
              type="button"
              className="md:hidden p-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent shrink-0 relative z-[60]"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — rendered outside the sticky header so it isn't confined to the
        header's local stacking context, the same way the Projects filter drawer is
        rendered at the page's top level. This guarantees it's always visibly on top. */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-[70] md:hidden" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              className="fixed top-0 right-0 h-full w-[82%] max-w-80 bg-lightCard dark:bg-darkSecondary z-[80] p-6 md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold heading text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent">
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {[{ to: '/', label: 'Home' }, ...menuItems].map(item => (
                  <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `px-4 py-3.5 rounded-lg text-base font-medium ${isActive ? 'text-accent bg-accent/10' : 'hover:bg-accent/10 hover:text-accent'}`}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}