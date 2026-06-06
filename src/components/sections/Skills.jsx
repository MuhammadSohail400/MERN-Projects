import { motion } from "framer-motion"
import { skills } from "../../data/skills"
import SkillCard from "../ui/SkillCard"
import SectionTitle from "../ui/SectionTitle"

// ── Animation Variants ───────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

// ── Stagger container — children ko ek ek karke animate karo
const staggerContainer = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.1,  // har card 0.1s baad aayega
    },
  },
}

const Skills = () => {
  return (
    <section
      id="skills"
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
        <SectionTitle label="Technical" highlight="Stack" />
        <p className="font-dm text-muted text-sm mt-2">
          Technologies I work with on a daily basis.
        </p>
      </motion.div>

      {/* Cards Grid — stagger container */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.category}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <SkillCard
              category={skill.category}
              icon={skill.icon}
              items={skill.items}
            />
          </motion.div>
        ))}
      </motion.div>

    </section>
  )
}

export default Skills