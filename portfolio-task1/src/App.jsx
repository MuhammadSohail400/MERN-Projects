import { useState, useEffect } from "react"
import Layout from "./components/layout/Layout"
import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import Skills from "./components/sections/Skills"
import Projects from "./components/sections/Projects"
import Experience from "./components/sections/Experience"
import Stats from "./components/sections/Stats"
import Contact from "./components/sections/Contact"
import ScrollToTopButton from "./components/ui/ScrollToTopButton"
import PageLoader from "./components/ui/PageLoader"
import Testimonials from "./components/sections/Testimonials"
import Achievements from "./components/sections/Achievements"

const App = () => {
    const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1.8s baad loader hide karo
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
    <PageLoader loading={loading} />
     {!loading && (
        <Layout>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Stats />
          <Experience />
          <Achievements />   
          <Testimonials />
          <Contact />
        </Layout>
      )}
       <ScrollToTopButton />
  </>
  )
}

export default App