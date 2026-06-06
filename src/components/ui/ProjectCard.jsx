import { ExternalLink, GitBranch } from "lucide-react"
import { motion } from "framer-motion"

const ProjectCard = ({ title, description, tags, demo, github, image }) => {
  return (
    <motion.div
      className="bg-surface border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-accent/30 transition-colors duration-200"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >

      {/* Image + Hover Overlay */}
      <div className="relative overflow-hidden h-48 group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Tags — normal state */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono bg-bg/80 backdrop-blur-sm text-accent border border-accent/20 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover Overlay — buttons */}
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition"
          >
            <ExternalLink size={14} />
            Live Demo
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/20 text-light px-4 py-2 rounded-lg text-sm font-medium hover:border-cyan hover:text-cyan transition"
          >
            <GitBranch size={14} />
            GitHub
          </a>
        </div>

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-syne font-bold text-light text-lg">
          {title}
        </h3>
        <p className="font-dm text-muted text-sm leading-relaxed flex-1">
          {description}
        </p>
      </div>

    </motion.div>
  )
}

export default ProjectCard