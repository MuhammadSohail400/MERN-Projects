import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

const ScrollToTopButton = () => {

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 p-3 bg-accent rounded-full text-white shadow-[0_0_20px_#6C63FF66] hover:shadow-[0_0_30px_#6C63FF99] transition-shadow duration-200"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1  }}
          exit={{    opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{  scale: 0.9 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTopButton