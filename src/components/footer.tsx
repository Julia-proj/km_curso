"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="py-12 md:py-16 px-5 bg-bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="font-display text-lg font-medium text-text-on-dark mb-2">
              HAIRLAB
            </p>
            <p className="text-text-on-dark/60 text-sm">Keratin Madrid</p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <a
              href="#about"
              className="text-text-on-dark/60 hover:text-text-on-dark transition-colors"
            >
              О проекте
            </a>
            <a
              href="#terms"
              className="text-text-on-dark/60 hover:text-text-on-dark transition-colors"
            >
              Условия
            </a>
            <a
              href="#privacy"
              className="text-text-on-dark/60 hover:text-text-on-dark transition-colors"
            >
              Политика конфиденциальности
            </a>
          </div>

          <a
            href="https://instagram.com/keratinmadrid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-on-dark/60 hover:text-text-on-dark transition-colors text-sm"
          >
            Instagram: @keratinmadrid
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-text-on-dark/10">
          <p className="text-text-on-dark/40 text-xs text-center">
            © {new Date().getFullYear()} HAIRLAB. Все права защищены.
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
