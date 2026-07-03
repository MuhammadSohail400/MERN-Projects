import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "../../data/projects"
import ProjectCard from "../ui/ProjectCard"
import SectionTitle from "../ui/SectionTitle"

// ── Filter Tabs Config ───────────────────────────────
const tabs = [
  { label: "All",       value: "all"      },
  { label: "Frontend",  value: "frontend" },
  { label: "Full Stack",value: "fullstack"},
]

// ── Animation Variants ───────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

// ── Component ────────────────────────────────────────
const Projects = () => {

  const [activeTab, setActiveTab] = useState("all")

  // Filter logic
  const filtered = activeTab === "all"
    ? projects
    : projects.filter((p) => p.category === activeTab)

  return (
    <section
      id="projects"
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
        <SectionTitle label="Featured" highlight="Exhibits" />
        <p className="font-dm text-muted text-sm mt-2">
          Selection of recent technical implementations.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2 mt-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium font-dm
              transition-all duration-200
              ${activeTab === tab.value
                ? "bg-accent text-white"
                : "bg-surface text-muted hover:text-light border border-white/5"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.tags}
                demo={project.demo}
                github={project.github}
                image={project.image}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

    </section>
  )
}

export default Projects