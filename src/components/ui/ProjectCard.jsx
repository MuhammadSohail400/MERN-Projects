import { ExternalLink, GitBranch } from "lucide-react"
import { motion } from "framer-motion";

const ProjectCard = ({ title, description, tags, demo, github, image }) => {
  return (
    <motion.div
      className="bg-surface border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-accent/30 transition-colors duration-200"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Tags Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono bg-bg/80 backdrop-blur-sm text-accent border border-accent/20 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
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

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-2 border-t border-white/5">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan text-sm font-medium hover:underline transition"
          >
            <ExternalLink size={14} />
            Live Demo
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted text-sm hover:text-light transition"
          >
            <GitBranch size={14} />

            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;