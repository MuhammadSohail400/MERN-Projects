import { motion } from "framer-motion"
import { experience } from "../../data/experience"
import TimelineItem from "../ui/TimelineItem"
import SectionTitle from "../ui/SectionTitle"

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

const Experience = () => {
  return (
    <section
      id="experience"
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
        <SectionTitle label="My" highlight="Journey" />
        <p className="font-dm text-muted text-sm mt-2">
          Experience and education timeline.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="mt-12">
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

    </section>
  )
}

export default Experience