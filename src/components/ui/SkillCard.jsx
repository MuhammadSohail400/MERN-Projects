// ── Level badge color helper ─────────────────────────
const levelColors = {
  Advanced:     "text-cyan   bg-cyan/10",
  Intermediate: "text-accent bg-accent/10",
  Beginner:     "text-muted  bg-white/5",
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
      <ul className="flex flex-col gap-3">
        {items.map((skill) => (
          <li
            key={skill.name}
            className="flex items-center justify-between"
          >
            {/* Skill Name */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
              <span className="font-dm text-muted text-sm">
                {skill.name}
              </span>
            </div>

            {/* Level Badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${levelColors[skill.level]}`}
            >
              {skill.level}
            </span>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default SkillCard