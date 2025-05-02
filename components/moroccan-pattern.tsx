"use client"

import { useEffect, useRef } from "react"

interface MoroccanPatternProps {
  className?: string
}

export default function MoroccanPattern({ className = "" }: MoroccanPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawPattern()
    }

    window.addEventListener("resize", updateCanvasSize)
    updateCanvasSize()

    function drawPattern() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Define pattern size
      const tileSize = 80
      const rows = Math.ceil(canvas.height / tileSize)
      const cols = Math.ceil(canvas.width / tileSize)

      // Define colors
      const isDarkMode = document.documentElement.classList.contains("dark")
      const strokeColor = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"

      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 1

      // Draw Moroccan star pattern
      for (let row = -1; row <= rows; row++) {
        for (let col = -1; col <= cols; col++) {
          const x = col * tileSize
          const y = row * tileSize

          // Draw octagon
          ctx.beginPath()
          const offset = tileSize / 4

          ctx.moveTo(x + offset, y)
          ctx.lineTo(x + tileSize - offset, y)
          ctx.lineTo(x + tileSize, y + offset)
          ctx.lineTo(x + tileSize, y + tileSize - offset)
          ctx.lineTo(x + tileSize - offset, y + tileSize)
          ctx.lineTo(x + offset, y + tileSize)
          ctx.lineTo(x, y + tileSize - offset)
          ctx.lineTo(x, y + offset)
          ctx.closePath()
          ctx.stroke()

          // Draw inner star
          ctx.beginPath()
          const center = tileSize / 2
          const innerOffset = tileSize / 8

          ctx.moveTo(x + center, y + innerOffset)
          ctx.lineTo(x + center + innerOffset, y + center - innerOffset)
          ctx.lineTo(x + tileSize - innerOffset, y + center)
          ctx.lineTo(x + center + innerOffset, y + center + innerOffset)
          ctx.lineTo(x + center, y + tileSize - innerOffset)
          ctx.lineTo(x + center - innerOffset, y + center + innerOffset)
          ctx.lineTo(x + innerOffset, y + center)
          ctx.lineTo(x + center - innerOffset, y + center - innerOffset)
          ctx.closePath()
          ctx.stroke()
        }
      }
    }

    // Update pattern when dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          drawPattern()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={`${className}`} />
}
