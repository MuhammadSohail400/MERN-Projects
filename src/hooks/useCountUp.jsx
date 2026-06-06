import { useState, useEffect, useRef } from "react"

const useCountUp = (target, duration = 2000) => {

  const [count, setCount]     = useState(0)
  const [started, setStarted] = useState(false)
  const ref                   = useRef(null)

  // IntersectionObserver — element visible ho tab start karo
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }  // 50% visible ho tab trigger
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [started])

  // Count up animation
  useEffect(() => {
    if (!started) return

    let startTime = null
    let animId

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp

      // Progress — 0 to 1
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // easeOut formula — fast start, slow end
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animId = requestAnimationFrame(animate)
      } else {
        setCount(target) // exact number pe end karo
      }
    }

    animId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animId)

  }, [started, target, duration])

  return { count, ref }
}

export default useCountUp