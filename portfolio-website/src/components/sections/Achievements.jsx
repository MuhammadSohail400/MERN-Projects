import { motion } from "framer-motion"
import { achievements } from "../../data/achievements"
import SectionTitle from "../ui/SectionTitle"

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const Achievements = () => {
  return (
    <section
      id="achievements"
      className="py-24 px-8 md:px-16 lg:px-24"
    >

      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle label="Achievements &" highlight="Highlights" />
        <p className="font-dm text-muted text-sm mt-2">
          Milestones and accomplishments so far.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {achievements.map((item) => (
          <motion.div
            key={item.id}
            className="bg-surface border border-white/5 rounded-xl p-5 flex items-start gap-4 hover:border-accent/30 transition-colors duration-200"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            {/* Icon */}
            <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
              <item.icon size={20} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h4 className="font-syne font-bold text-light text-sm">
                {item.title}
              </h4>
              <p className="font-dm text-muted text-xs leading-relaxed">
                {item.description}
              </p>
            </div>

          </motion.div>
        ))}
      </motion.div>

    </section>
  )
}

export default Achievements