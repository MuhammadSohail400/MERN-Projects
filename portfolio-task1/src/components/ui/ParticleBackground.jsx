import { useEffect, useRef } from "react"

// ── Particle Class ───────────────────────────────────
class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x      = Math.random() * this.canvas.width
    this.y      = Math.random() * this.canvas.height
    this.vx     = (Math.random() - 0.5) * 0.4   // x velocity
    this.vy     = (Math.random() - 0.5) * 0.4   // y velocity
    this.radius = Math.random() * 1.5 + 0.5      // size
    this.alpha  = Math.random() * 0.5 + 0.2      // opacity
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Boundary check — edge pe wapas aao
    if (this.x < 0 || this.x > this.canvas.width)  this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`
    ctx.fill()
  }
}

// ── Component ────────────────────────────────────────
const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas  = canvasRef.current
    const ctx     = canvas.getContext("2d")
    let particles = []
    let animId

    // Canvas size = window size
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // Resize pe particles reset karo
      particles = Array.from(
        { length: 80 },
        () => new Particle(canvas)
      )
    }

    // Draw lines between nearby particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // 120px se zyada door hain toh line mat banao
          if (dist > 120) continue

          const opacity = (1 - dist / 120) * 0.15
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`
          ctx.lineWidth   = 0.5
          ctx.stroke()
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })

      drawLines()
      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener("resize", resize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}

export default ParticleBackground