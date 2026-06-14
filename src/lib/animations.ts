export const ease = [0.22, 1, 0.36, 1] as const
export const viewport = { once: true, margin: "-80px" } as const

// Check for reduced motion preference
export function getReducedMotion() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

export function fadeUp(delay = 0) {
  const reducedMotion = getReducedMotion()
  
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: {
      duration: reducedMotion ? 0 : 0.6,
      ease,
      delay: reducedMotion ? 0 : delay,
    },
  }
}
