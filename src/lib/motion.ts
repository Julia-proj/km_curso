import { useReducedMotion } from 'framer-motion'

/**
 * Hook to get reduced motion preference for accessibility and performance
 */
export function useMotion() {
  const prefersReducedMotion = useReducedMotion()

  return {
    prefersReducedMotion,
    // Disable animations when user prefers reduced motion
    animate: prefersReducedMotion ? false : true,
    transition: prefersReducedMotion ? { duration: 0 } : undefined,
  }
}
