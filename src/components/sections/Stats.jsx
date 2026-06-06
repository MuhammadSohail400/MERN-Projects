import useCountUp from "../../hooks/useCountUp"

// ── Single Stat Item ─────────────────────────────────
const StatItem = ({ value, label, duration }) => {

  const { count, ref } = useCountUp(value, duration)

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2"
    >
      {/* Animated Number */}
      <span className="font-syne font-extrabold text-4xl bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent">
        {count}+
      </span>

      {/* Label */}
      <span className="font-mono text-muted text-xs tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}

// ── Stats Data ───────────────────────────────────────
const stats = [
  { value: 10, label: "PROJECTS COMPLETED", duration: 2000 },
  { value: 15, label: "TECH STACK TOOLS",   duration: 2500 },
  { value: 5,  label: "CERTIFICATIONS",     duration: 1500 },
]

// ── Main Component ───────────────────────────────────
const Stats = () => {
  return (
    <section className="py-12 px-8 md:px-16 lg:px-24 border-y border-white/5">
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            label={stat.label}
            duration={stat.duration}
          />
        ))}
      </div>
    </section>
  )
}

export default Stats