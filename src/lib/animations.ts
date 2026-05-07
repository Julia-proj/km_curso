export const ease = [0.22, 1, 0.36, 1] as const
export const viewport = { once: true, margin: "-80px" } as const

export function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration: 0.8, ease, delay },
  }
}
