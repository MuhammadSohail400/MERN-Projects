import Navbar from "./Navbar"
import Footer from "./Footer"
import ParticleBackground from "../ui/ParticleBackground"
import CustomCursor from "../ui/CustomCursor"

const Layout = ({ children }) => {
  return (
    <div className="bg-bg min-h-screen relative">

      {/* Global — har jagah dikhega */}
      <ParticleBackground />
      <CustomCursor />

      {/* Content — particles ke upar */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default Layout