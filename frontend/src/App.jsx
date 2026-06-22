import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import HeroEditor from './pages/admin/HeroEditor.jsx'
import Uploads from './pages/admin/Uploads.jsx'
import AboutEditor from './pages/admin/AboutEditor.jsx'
import SkillsEditor from './pages/admin/SkillsEditor.jsx'
import CertificationsEditor from './pages/admin/CertificationsEditor.jsx'
import ProjectsEditor from './pages/admin/ProjectsEditor.jsx'
import ContactEditor from './pages/admin/ContactEditor.jsx'
import FooterEditor from './pages/admin/FooterEditor.jsx'
import Messages from './pages/admin/Messages.jsx'
import Settings from './pages/admin/Settings.jsx'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="uploads" element={<Uploads />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="certifications" element={<CertificationsEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="footer" element={<FooterEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}
