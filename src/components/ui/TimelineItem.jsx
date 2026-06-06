import { motion } from "framer-motion"

const TimelineItem = ({ year, role, company, description, isLast }) => {
  return (
    <div className="flex gap-4">

      {/* ── Left — dot + line ── */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className="w-3 h-3 rounded-full bg-cyan mt-1.5 flex-shrink-0" />
        {/* Line — last item mein nahi dikhegi */}
        {!isLast && (
          <div className="w-px flex-1 bg-white/10 mt-1" />
        )}
      </div>

      {/* ── Right — content ── */}
      <motion.div
        className="pb-10 flex flex-col gap-1"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Year */}
        <span className="font-mono text-cyan text-xs tracking-widest uppercase">
          {year}
        </span>

        {/* Role */}
        <h4 className="font-syne font-bold text-light text-base mt-1">
          {role}
        </h4>

        {/* Company */}
        <p className="text-accent text-sm font-medium">
          {company}
        </p>

        {/* Description */}
        <p className="font-dm text-muted text-sm leading-relaxed mt-1 max-w-lg">
          {description}
        </p>

      </motion.div>

    </div>
  )
}

export default TimelineItem