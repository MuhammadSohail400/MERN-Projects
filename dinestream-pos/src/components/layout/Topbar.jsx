import { useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { BellIcon, SearchIcon, PlusIcon } from '../../assets/icons/index'

// ─── Page title mapping ───────────────────────────────────────
const PAGE_TITLES = {
  '/':         { title: 'Dashboard',  sub: 'Welcome back'           },
  '/orders':   { title: 'Orders',     sub: 'Manage all orders'      },
  '/menu':     { title: 'Menu',       sub: 'Manage your menu items' },
  '/tables':   { title: 'Tables',     sub: 'Floor map & status'     },
  '/staff':    { title: 'Staff',      sub: 'Team management'        },
  '/reports':  { title: 'Reports',    sub: 'Sales & analytics'      },
  '/settings': { title: 'Settings',   sub: 'Account preferences'    },
}

// ─── Action buttons per page ──────────────────────────────────
const PAGE_ACTIONS = {
  '/orders': { label: 'New Order',     path: '/orders/new' },
  '/menu':   { label: 'Add Item',      path: '/menu'       },
  '/staff':  { label: 'Add Staff',     path: '/staff'      },
  '/tables': { label: 'Add Table',     path: '/tables'     },
}

// ─── Hamburger icon (mobile only) ──────────────────────────────
const HamburgerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

// ════════════════════════════════════════════════════════
// TOPBAR COMPONENT
// ════════════════════════════════════════════════════════
const Topbar = ({ onMenuClick }) => {
  const location = useLocation()
  const { user } = useAuth()

  const pageInfo   = PAGE_TITLES[location.pathname]  || PAGE_TITLES['/']
  const pageAction = PAGE_ACTIONS[location.pathname]

  return (
    <div className="app-topbar" style={{
      height: 60,
      background: '#111113',
      borderBottom: '1px solid #ffffff08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      position: 'sticky',
      top: 0, zIndex: 10,
      gap: 12,
    }}>

      {/* ── Left: Hamburger (mobile) + Page Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="topbar-hamburger"
          style={{
            display: 'none',
            width: 34, height: 34, flexShrink: 0,
            background: '#18181b',
            border: '1px solid #ffffff0a',
            borderRadius: 8,
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#a1a1aa',
          }}
        >
          <HamburgerIcon />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 16, fontWeight: 700,
            color: '#f4f4f5',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {pageInfo.title}
          </h1>
          <p className="topbar-subtitle" style={{
            fontSize: 11, color: '#52525b', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {pageInfo.sub}
          </p>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {/* Search — hidden on small screens */}
        <div className="topbar-search" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#18181b',
          border: '1px solid #ffffff0a',
          borderRadius: 8,
          padding: '7px 12px',
          cursor: 'text',
        }}>
          <SearchIcon size={14} />
          <span style={{ fontSize: 12, color: '#3f3f46' }}>
            Search...
          </span>
          <span style={{
            fontSize: 10, color: '#3f3f46',
            background: '#242428',
            border: '1px solid #ffffff0a',
            borderRadius: 4, padding: '1px 5px',
          }}>
            ⌘K
          </span>
        </div>

        {/* Notification Bell */}
        <button style={{
          position: 'relative',
          width: 34, height: 34, flexShrink: 0,
          background: '#18181b',
          border: '1px solid #ffffff0a',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#71717a',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#ffffff18'
            e.currentTarget.style.color = '#f4f4f5'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#ffffff0a'
            e.currentTarget.style.color = '#71717a'
          }}
        >
          <BellIcon size={15} />
          {/* Notification dot */}
          <div style={{
            position: 'absolute', top: 7, right: 7,
            width: 6, height: 6,
            background: '#f97316',
            borderRadius: '50%',
            border: '1.5px solid #111113',
          }}/>
        </button>

        {/* CTA Button — page ke hisaab se, label hides on very small screens */}
        {pageAction && (
          <button className="topbar-cta" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 8,
            padding: '8px 14px',
            fontSize: 12, fontWeight: 600,
            color: 'white', cursor: 'pointer',
            boxShadow: '0 0 16px #f9731630',
            transition: 'opacity 0.15s, transform 0.1s',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <PlusIcon size={12} />
            <span className="topbar-cta-label">{pageAction.label}</span>
          </button>
        )}

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, flexShrink: 0,
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
          cursor: 'pointer',
          boxShadow: '0 0 12px #f9731630',
        }}>
          {user?.name?.charAt(0) || 'A'}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .topbar-hamburger {
            display: flex !important;
          }
          .topbar-search {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .app-topbar {
            padding: 0 14px !important;
          }
          .topbar-subtitle {
            display: none;
          }
          .topbar-cta-label {
            display: none;
          }
          .topbar-cta {
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Topbar