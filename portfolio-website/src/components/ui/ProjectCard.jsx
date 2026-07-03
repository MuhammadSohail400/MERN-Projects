import { ExternalLink, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({ title, description, tags, demo, github, image }) => {
  return (
    <motion.div
      className="bg-surface border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-accent/30 transition-colors duration-200 min-h-80 md:min-h-0"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Container Adjustment:
        Mobile par yeh pure card ka relative base banega taaki content iske upar absolute overlay ho sake.
        Desktop (md:) par yeh standard h-48 block par wapas aa jayega.
      */}
      <div className="relative overflow-hidden flex-1 md:h-48 md:flex-initial group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover absolute inset-0 md:relative transition-transform duration-500 group-hover:scale-105"
        />

        {/* Mobile Gradient Overlay (Design se match karne ke liye taaki text readable ho) */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30 md:hidden z-10" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono bg-bg/80 backdrop-blur-sm text-accent border border-accent/20 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Desktop Hover Overlay (Stays hidden on mobile) */}
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden md:flex">
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

        {/* Mobile Content Overlay:
          Mobile par content ko absolute positioning di hai taaki image ke upar dikhe jaisa image mein hai.
          Desktop (md:) par yeh niche standard panel ban jayega (`md:relative md:inset-auto md:bg-transparent`).
        */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2 z-20 justify-end md:relative md:inset-auto md:p-5 md:bg-transparent md:flex-1 md:gap-3">
          <h3 className="font-syne font-bold text-white md:text-light text-2xl md:text-lg tracking-wide md:tracking-normal">
            {title}
          </h3>

          <p className="font-dm text-white/80 md:text-muted text-sm leading-relaxed max-w-[90%] md:max-w-none line-clamp-2 md:line-clamp-none">
            {description}
          </p>

          {/* Mobile Buttons (Exactly like your design: Live Demo with cyan icon/text & Github side by side) */}
          <div className="flex items-center gap-6 pt-4 mt-1 md:hidden">
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan text-base font-semibold hover:underline transition"
            >
              <ExternalLink size={16} className="text-cyan" />
              Live Demo
            </a>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-base font-semibold hover:text-muted transition"
            >
              <GitBranch size={16} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;