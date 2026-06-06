import { motion } from "framer-motion"

// ── Level badge colors ───────────────────────────────
const levelColors = {
  Advanced:     "text-cyan   bg-cyan/10",
  Intermediate: "text-accent bg-accent/10",
  Beginner:     "text-muted  bg-white/5",
}

// ── Progress bar colors ──────────────────────────────
const barColors = {
  Advanced:     "bg-cyan",
  Intermediate: "bg-accent",
  Beginner:     "bg-muted",
}

// ── Component ────────────────────────────────────────
const SkillCard = ({ category, icon: Icon, items }) => {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-6 flex flex-col gap-5 hover:border-accent/30 transition-colors duration-200">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <Icon size={20} />
        </div>
        <h3 className="font-syne font-bold text-light text-lg">
          {category}
        </h3>
      </div>

      {/* Skills List */}
      <ul className="flex flex-col gap-4">
        {items.map((skill) => (
          <li key={skill.name} className="flex flex-col gap-1.5">

            {/* Name + Badge row */}
            <div className="flex items-center justify-between">
              <span className="font-dm text-muted text-sm">
                {skill.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${levelColors[skill.level]}`}>
                {skill.percent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColors[skill.level]}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              />
            </div>

          </li>
        ))}
      </ul>

    </div>
  )
}

export default SkillCard