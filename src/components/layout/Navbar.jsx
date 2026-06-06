const Navbar = () => {
  const navLinks = ["Projects", "Skills", "Experience", "Contact"]

  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <span className="font-mono text-cyan text-xl font-bold">MS.</span>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-muted hover:text-light text-sm transition-colors duration-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
        Resume
      </button>
    </nav>
  )
}

export default Navbar