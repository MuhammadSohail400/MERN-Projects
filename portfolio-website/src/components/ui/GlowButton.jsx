const GlowButton = ({ children, onClick, variant = "primary" }) => {

  const base = `
    px-6 py-3 rounded-lg font-medium text-sm
    transition-all duration-200 cursor-pointer
    flex items-center gap-2
  `

  const variants = {
    primary: "bg-accent text-white hover:shadow-[0_0_25px_#6C63FF88]",
    outline: "border border-muted text-light hover:border-cyan hover:text-cyan",
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default GlowButton