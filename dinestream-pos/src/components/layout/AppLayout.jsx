import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = () => {

  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()

  const handleToggle = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const handleMobileToggle = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  // Close mobile drawer automatically whenever the route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    // ─── Outer wrapper — full viewport, no scroll ──────────────
    <div style={{
      display: 'flex',
      height: '100vh',        // ← 100vh fixed height
      overflow: 'hidden',     // ← bahar kuch scroll nahi hoga
      background: '#0a0a0b',
    }}>

      {/* ── Sidebar — fixed height, no scroll ── */}
      {/* Desktop: normal sticky column. Mobile: becomes an overlay drawer (handled inside Sidebar via CSS). */}
      <div
        className="app-sidebar-wrap"
        style={{
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          mobileOpen={mobileOpen}
          onCloseMobile={closeMobile}
        />
      </div>

      {/* Mobile backdrop — shown only when drawer is open on small screens */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="app-mobile-backdrop"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── Right Side — Topbar fixed + Content scrollable ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',       // ← full height
        overflow: 'hidden',    // ← scroll andar hoga
      }}>

        {/* Topbar — fixed at top, never scrolls */}
        <div style={{
          flexShrink: 0,       // ← topbar height fixed rahe
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Topbar onMenuClick={handleMobileToggle} />
        </div>

        {/* ── Main Content — ONLY THIS SCROLLS ── */}
        <main className="app-main-content" style={{
          flex: 1,
          overflowY: 'auto',   // ← sirf yeh scroll karega
          overflowX: 'hidden',
          padding: 24,
          background: '#0a0a0b',
        }}>
          <Outlet />
        </main>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .app-sidebar-wrap {
            position: fixed !important;
            left: 0;
            top: 0;
            z-index: 50;
          }
          .app-main-content {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AppLayout