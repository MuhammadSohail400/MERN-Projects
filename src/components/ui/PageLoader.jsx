import { motion, AnimatePresence } from "framer-motion"

const PageLoader = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-bg flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.span
            className="font-mono text-cyan text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            MS.
          </motion.span>

          {/* Loading bar */}
          <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan to-accent rounded-full"
              initial={{ width: "0%"   }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>

          {/* Text */}
          <motion.p
            className="font-mono text-muted text-xs tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Initializing...
          </motion.p>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageLoader