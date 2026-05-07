"use client"

import { motion } from "framer-motion"

export function CTA({
  children,
  href,
  variant = "dark",
}: {
  children: React.ReactNode
  href: string
  variant?: "dark" | "light"
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`km-cta ${variant === "dark" ? "km-cta--dark" : "km-cta--light"}`}
    >
      <span>{children}</span>
    </motion.a>
  )
}
