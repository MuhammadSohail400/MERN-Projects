
import { motion, useScroll, useSpring } from "framer-motion"

const ScrollProgressBar = () => {

  const { scrollYProgress } = useScroll()

  // Spring — smooth feel
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-99999 h-2px origin-left bg-linear-to-r from-cyan via-accent to-cyan"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgressBar