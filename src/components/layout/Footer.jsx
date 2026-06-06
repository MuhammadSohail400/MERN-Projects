
import { Mail, GitBranch, ExternalLink} from "lucide-react"

// ── Data ─────────────────────────────────────────────
const navLinks = [
  { label: "About",      href: "about"      },
  { label: "Skills",     href: "skills"     },
  { label: "Projects",   href: "projects"   },
  { label: "Experience", href: "experience" },
  { label: "Contact",    href: "contact"    },
]

const socialLinks = [
  {
    icon: GitBranch,
    label: "GitHub",
    href: "https://github.com/MuhammadSohail400",
  },
  {
    icon: ExternalLink,
    label: "LinkedIn",
    href: "https://linkedin.com/in/muhammad-sohail-a15a38248",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:msohailg211@gmail.com",
  },
]

// ── Scroll to top ────────────────────────────────────


// ── Smooth scroll helper ─────────────────────────────
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

// ── Component ────────────────────────────────────────
const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 px-8 md:px-16 lg:px-24 pt-16 pb-8">

      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-white/5">

        {/* Left — Logo + Tagline */}
        <div className="flex flex-col gap-3 max-w-xs">
          <span className="font-mono text-cyan text-2xl font-bold tracking-tight">
            MS.
          </span>
          <p className="font-dm text-muted text-sm leading-relaxed">
            Frontend Developer based in Karachi, Pakistan.
            Building fast, beautiful, and scalable web experiences.
          </p>
        </div>

        {/* Right — Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs text-muted uppercase tracking-widest">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="font-dm text-sm text-muted hover:text-cyan transition-colors duration-200"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">

        {/* Copyright */}
        <p className="font-mono text-muted text-xs">
          © 2026 Muhammad Sohail. Engineered with precision.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-2 text-muted hover:text-cyan transition-colors duration-200"
            >
              <social.icon size={16} />
            </a>
          ))}
        </div>

        {/* Built with */}
        <p className="font-mono text-muted text-xs">
          Built with{" "}
          <span className="text-accent">React</span>
          {" & "}
          <span className="text-cyan">Tailwind</span>
        </p>

      </div>



    </footer>
  )
}

export default Footer