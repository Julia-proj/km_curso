"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F4]"
    >
      <div className="flex flex-col items-center gap-10">
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-hero-face text-4xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl"
        >
          HAIRLAB
        </motion.h1>

        <div className="relative h-20 w-20">
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, -20, 0], scale: [1, 0.8, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D29B9B]"
          />
          <motion.div
            animate={{ x: [10, -10, 10], y: [10, -10, 10], scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: -0.8 }}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D29B9B]"
          />
          <motion.div
            animate={{ x: [-15, 15, -15], y: [-5, 15, -5], scale: [1, 0.6, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: -1.2 }}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D29B9B]"
          />
        </div>
      </div>
    </motion.div>
  )
}
