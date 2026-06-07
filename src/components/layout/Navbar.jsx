import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useActiveSection from "../../hooks/useActiveSection"
import logo from "../../assets/images/logo.png"
// ── Nav Links Config ─────────────────────────────────
const navLinks = [
  { label: "Projects",     href: "projects"     },
  { label: "Skills",       href: "skills"       },
  { label: "Experience",   href: "experience"   },
  { label: "Achievements", href: "achievements" },
  { label: "Contact",      href: "contact"      },
]
const sectionIds = navLinks.map((link) => link.href)

// ── Component ────────────────────────────────────────
const Navbar = () => {

  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const activeSection = useActiveSection(sectionIds)

  // Scroll detect — glassmorphism trigger
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll handler
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-8 md:px-16 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >

      {/* Logo */}
      <img
          src={logo}
          alt="MS Logo"
          className="h-10 w-auto object-contain"
        />

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <button
              onClick={() => scrollTo(link.href)}
              className={`text-sm font-dm transition-colors duration-200 ${
                activeSection === link.href
                  ? "text-cyan"
                  : "text-muted hover:text-light"
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Resume Button */}
      <div className="hidden md:block">
        <button
          onClick={() => window.open("/resume.pdf")}
          className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-[0_0_20px_#6C63FF88] transition-all duration-200"
        >
          Resume
        </button>
      </div>

      {/* Mobile — Hamburger */}
      <button
        className="md:hidden text-muted hover:text-light transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-md border-b border-white/5 flex flex-col px-8 py-6 gap-5 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-dm text-left transition-colors duration-200 ${
                  activeSection === link.href
                    ? "text-cyan"
                    : "text-muted hover:text-light"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => window.open("/resume.pdf")}
              className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium w-fit"
            >
              Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  )
}

export default Navbar