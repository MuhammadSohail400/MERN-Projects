import { motion } from "framer-motion"
import { testimonials } from "../../data/testimonials"
import SectionTitle from "../ui/SectionTitle"

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
}

// ── Local Component ──────────────────────────────────
const TestimonialCard = ({ name, role, message, icon: Icon }) => {
  return (
    <motion.div
      className="bg-surface border border-white/5 rounded-xl p-6 flex flex-col gap-4 hover:border-accent/30 transition-colors duration-200"
      variants={fadeUp}
      transition={{ duration: 0.5 }}
    >
      {/* Quote */}
      <p className="font-dm text-muted text-sm leading-relaxed italic">
        "{message}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <Icon size={18} />
        </div>
        <div>
          <h4 className="font-syne font-bold text-light text-sm">
            {name}
          </h4>
          <p className="text-muted text-xs">{role}</p>
        </div>
      </div>

    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────
const Testimonials = () => {
  return (
    <section
      id="testimonials"
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
        <SectionTitle label="What People" highlight="Say" />
        <p className="font-dm text-muted text-sm mt-2">
          Endorsements from colleagues and supervisors.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((t) => (
          <TestimonialCard
            key={t.id}
            name={t.name}
            role={t.role}
            message={t.message}
            icon={t.icon}
          />
        ))}
      </motion.div>

    </section>
  )
}

export default Testimonials