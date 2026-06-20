import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = () => {

  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  return (
    // ─── Outer wrapper — full viewport, no scroll ──────────────
    <div style={{
      display: 'flex',
      height: '100vh',        // ← 100vh fixed height
      overflow: 'hidden',     // ← bahar kuch scroll nahi hoga
      background: '#0a0a0b',
    }}>

      {/* ── Sidebar — fixed height, no scroll ── */}
      <div style={{
        height: '100vh',       // ← full height
        position: 'sticky',    // ← apni jagah fixed
        top: 0,
        flexShrink: 0,         // ← sidebar squeeze nahi hoga
      }}>
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
        />
      </div>

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
          <Topbar />
        </div>

        {/* ── Main Content — ONLY THIS SCROLLS ── */}
        <main style={{
          flex: 1,
          overflowY: 'auto',   // ← sirf yeh scroll karega
          overflowX: 'hidden',
          padding: 24,
          background: '#0a0a0b',
        }}>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AppLayout