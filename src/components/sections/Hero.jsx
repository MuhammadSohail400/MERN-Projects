import { TypeAnimation } from "react-type-animation"
import { ArrowRight, Download } from "lucide-react"
import { motion } from "framer-motion"
import GlowButton from "../ui/GlowButton"
import profile from "../../assets/images/profile.png"

// ── Animation Variants ──────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

// ── Component ───────────────────────────────────────
const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center px-8 md:px-16 lg:px-24 pt-20"
    >
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">

        {/* ── Left Side ── */}
        <motion.div
          className="flex-1 flex flex-col gap-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >

          {/* Greeting */}
          <motion.p
            className="font-mono text-cyan text-sm tracking-widest uppercase"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            className="font-syne text-5xl md:text-6xl lg:text-7xl font-extrabold text-light leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Muhammad <br />
            <span className="text-accent">Sohail</span>
          </motion.h1>

          {/* Typing Animation */}
          <motion.div
            className="font-mono text-muted text-sm md:text-base tracking-wide"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TypeAnimation
              sequence={[
                "Frontend Developer",       2000,
                "React Specialist",         2000,
                "MERN Stack Developer",     2000,
                "UI Enthusiast",            2000,
              ]}
              repeat={Infinity}
              wrapper="span"
              className="text-cyan"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="font-dm text-muted text-base md:text-lg max-w-md leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            I build fast, beautiful, and scalable web experiences.
            Currently pursuing BSCS at{" "}
            <span className="text-light font-medium">MAJU Karachi</span>.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 mt-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GlowButton
              variant="primary"
              onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
            >
              View Projects <ArrowRight size={16} />
            </GlowButton>

            <GlowButton
              variant="outline"
              onClick={() => window.open("/resume.pdf")}
            >
              Download Resume <Download size={16} />
            </GlowButton>
          </motion.div>

        </motion.div>

        {/* ── Right Side — Profile Image ── */}
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">

            {/* Glow ring behind image */}
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl" />

            {/* Profile image */}
            <img
              src={profile}
              alt="Muhammad Sohail"
              className="relative z-10 w-full h-full object-cover rounded-full border-2 border-accent/50"
            />

          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero