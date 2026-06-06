import { useEffect, useRef } from "react"

const CustomCursor = () => {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    // Current mouse position
    let mouseX = 0
    let mouseY = 0

    // Ring position — lag ke follow karta hai
    let ringX  = 0
    let ringY  = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot — directly follow karta hai
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    // Ring — smooth lag with lerp
    const animateRing = () => {
      // Linear interpolation — smooth following
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      requestAnimationFrame(animateRing)
    }

    // Hover effects — interactive elements pe
    const onMouseEnter = () => {
      ring.style.width   = "48px"
      ring.style.height  = "48px"
      ring.style.opacity = "0.6"
      dot.style.opacity  = "0"
    }

    const onMouseLeave = () => {
      ring.style.width   = "32px"
      ring.style.height  = "32px"
      ring.style.opacity = "1"
      dot.style.opacity  = "1"
    }

    // All interactive elements
    const interactives = document.querySelectorAll(
      "a, button, [role='button']"
    )

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter)
      el.addEventListener("mouseleave", onMouseLeave)
    })

    window.addEventListener("mousemove", onMouseMove)
    animateRing()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter)
        el.removeEventListener("mouseleave", onMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width:           "6px",
          height:          "6px",
          borderRadius:    "50%",
          backgroundColor: "#00D4FF",
          marginLeft:      "-3px",
          marginTop:       "-3px",
          transition:      "opacity 0.2s",
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width:        "32px",
          height:       "32px",
          borderRadius: "50%",
          border:       "1px solid rgba(108, 99, 255, 0.6)",
          marginLeft:   "-16px",
          marginTop:    "-16px",
          transition:   "width 0.3s, height 0.3s, opacity 0.3s",
        }}
      />
    </>
  )
}

export default CustomCursor