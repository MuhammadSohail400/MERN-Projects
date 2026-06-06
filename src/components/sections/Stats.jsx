import { motion } from "framer-motion"

const stats = [
  { value: "10+", label: "PROJECTS COMPLETED" },
  { value: "15+", label: "TECH STACK TOOLS"   },
  { value: "5+",  label: "CERTIFICATIONS"     },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

const Stats = () => {
  return (
    <section className="py-12 px-8 md:px-16 lg:px-24 border-y border-white/5">
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Value */}
            <span className="font-syne font-extrabold text-4xl bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent">
              {stat.value}
            </span>

            {/* Label */}
            <span className="font-mono text-muted text-xs tracking-widest uppercase">
              {stat.label}
            </span>

          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Stats