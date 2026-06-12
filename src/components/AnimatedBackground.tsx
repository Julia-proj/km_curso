"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Gradient blob parameters
    const blobs = [
      { x: 0.2, y: 0.3, radius: 400, speed: 0.0003, color: [250, 247, 244] },
      { x: 0.8, y: 0.2, radius: 350, speed: 0.0004, color: [245, 235, 225] },
      { x: 0.5, y: 0.7, radius: 450, speed: 0.00025, color: [240, 228, 215] },
      { x: 0.1, y: 0.8, radius: 380, speed: 0.00035, color: [248, 240, 232] },
      { x: 0.9, y: 0.6, radius: 420, speed: 0.00028, color: [242, 232, 220] },
    ]

    const render = () => {
      time += 1

      // Clear with base color
      ctx.fillStyle = "#FAF7F4"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw each blob
      blobs.forEach((blob, index) => {
        const offsetX = Math.sin(time * blob.speed + index) * 100
        const offsetY = Math.cos(time * blob.speed * 0.7 + index) * 80

        const x = blob.x * canvas.width + offsetX
        const y = blob.y * canvas.height + offsetY

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.radius)
        gradient.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.4)`)
        gradient.addColorStop(0.5, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.2)`)
        gradient.addColorStop(1, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  )
}
