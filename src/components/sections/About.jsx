import { motion } from "framer-motion"
import { MapPin, GraduationCap, Briefcase, Rocket } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
// import profile from "../../assets/images/profile.jpg"

// ── Animation Variants ──────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

// ── Local Component — sirf About mein use hoga ──────
const HighlightCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-4 flex items-start gap-3 hover:border-accent/30 transition-colors duration-200">
      <div className="p-2 rounded-lg bg-accent/10 text-accent mt-0.5">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-syne font-bold text-light text-sm">{title}</h4>
        <p className="text-muted text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ── Static Data — list nahi hai isliye data file nahi ──
const highlights = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "BSCS at MAJU Karachi — FA24-BSCS-0300",
  },
  {
    icon: Briefcase,
    title: "Experience",
    description: "Frontend Intern at DecodeLabs — April to May 2026",
  },
  {
    icon: Rocket,
    title: "Goal",
    description: "Becoming a MERN Stack Developer at a top Karachi tech firm",
  },
]

// ── Main Component ───────────────────────────────────
const About = () => {
  return (
    <section
      id="about"
      className="py-24 px-8 md:px-16 lg:px-24"
    >
      <div className="w-full flex flex-col md:flex-row items-center gap-16">

        {/* ── Left Side — Image ── */}
        <motion.div
          className="shrink-0"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72">

            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-cyan/10 blur-2xl" />

            {/* Image */}
            <img
              src="https://placehold.co/320x320"
              alt="Muhammad Sohail"
              className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/10"
            />

          </div>
        </motion.div>

        {/* ── Right Side — Content ── */}
        <motion.div
          className="flex-1 flex flex-col gap-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          {/* Title */}
          <SectionTitle label="Crafting Digital" highlight="Excellence" />

          {/* Bio */}
          <p className="font-dm text-muted text-base leading-relaxed max-w-lg">
            Currently pursuing a BSCS degree in the vibrant tech hub of
            Karachi. I am a passionate Frontend Developer evolving into a
            Full Stack Architect. My journey is defined by a relentless
            pursuit of clean code and exceptional user experiences.
          </p>

          <p className="font-dm text-muted text-base leading-relaxed max-w-lg">
            I specialize in building scalable web applications using React
            and Node.js. My goal is to bridge the gap between complex
            backend logic and intuitive frontend aesthetics — delivering
            products that matter.
          </p>

          {/* Location + Education Badges */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-muted text-sm">
              <MapPin size={14} className="text-cyan" />
              <span>Karachi, Pakistan</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm">
              <GraduationCap size={14} className="text-cyan" />
              <span>BS Computer Science</span>
            </div>
          </div>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {highlights.map((item) => (
              <HighlightCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  )
}

export default About