import { motion } from "framer-motion"
import { experience } from "../../data/experience"
import { certifications } from "../../data/certifications"
import TimelineItem from "../ui/TimelineItem"
import SectionTitle from "../ui/SectionTitle"

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

// ── Local Component — sirf Experience mein use hoga ──
const CertCard = ({ title, issuer, icon: Icon }) => {
  return (
    <motion.div
      className="bg-surface border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-accent/30 transition-colors duration-200"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0">
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <h4 className="font-syne font-bold text-light text-sm">
          {title}
        </h4>
        <p className="font-mono text-muted text-xs uppercase tracking-wider">
          {issuer}
        </p>
      </div>

    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────
const Experience = () => {
  return (
    <section
      id="experience"
      className="py-24 px-8 md:px-16 lg:px-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* ── Left — Experience Timeline ── */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle label="Experience" highlight="" />
            <p className="font-dm text-muted text-sm mt-2 mb-10">
              My professional journey so far.
            </p>
          </motion.div>

          {experience.map((item, index) => (
            <TimelineItem
              key={item.id}
              year={item.year}
              role={item.role}
              company={item.company}
              description={item.description}
              isLast={index === experience.length - 1}
            />
          ))}
        </div>

        {/* ── Right — Certifications ── */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle label="Certifications" highlight="" />
            <p className="font-dm text-muted text-sm mt-2 mb-10">
              Courses and certificates completed.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {certifications.map((cert) => (
              <CertCard
                key={cert.id}
                title={cert.title}
                issuer={cert.issuer}
                icon={cert.icon}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Experience