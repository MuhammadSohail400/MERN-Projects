import { useState, useEffect } from "react"

const useActiveSection = (sectionIds) => {

  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observers = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          // Section viewport ke 40% se upar aaye
          // tab active consider karo
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    // Cleanup — component unmount pe observers hata do
    return () => observers.forEach((obs) => obs.disconnect())

  }, [sectionIds])

  return activeSection
}

export default useActiveSection