"use client"

import { motion, useScroll } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-purple-500 z-[110] shadow-sm"
      style={{ 
        scaleX: scrollYProgress, 
        transformOrigin: "0%",
        willChange: "transform" // Optimize for animations
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}
