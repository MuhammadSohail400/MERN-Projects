const Footer = () => {
  return (
    <footer className="border-t border-surface py-6 px-8 flex items-center justify-between text-muted text-sm">
      <span className="font-mono text-cyan font-bold">MS.</span>
      <p>© 2025 Muhammad Sohail. Engineered with precision.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-light transition">GitHub</a>
        <a href="#" className="hover:text-light transition">LinkedIn</a>
        <a href="#" className="hover:text-light transition">Twitter</a>
      </div>
    </footer>
  )
}

export default Footer