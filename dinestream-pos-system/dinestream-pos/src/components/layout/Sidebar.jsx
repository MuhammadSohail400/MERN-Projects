import { NavLink, useNavigate } from 'react-router-dom'
import useRestaurant from '../../hooks/useRestaurant'
import useAuth from '../../hooks/useAuth'
import {
  DashboardIcon, OrdersIcon, MenuIcon, TablesIcon,
  StaffIcon, ReportsIcon, SettingsIcon,
  ChevronLeft, ChevronRight, LogoutIcon,
} from '../../assets/icons/index'

// ─── Nav Links Data ───────────────────────────────────────────
const NAV_LINKS = [
  { path: '/',         label: 'Dashboard', icon: DashboardIcon },
  { path: '/orders',   label: 'Orders',    icon: OrdersIcon,
    badge: 3 },
  { path: '/menu',     label: 'Menu',      icon: MenuIcon     },
  { path: '/tables',   label: 'Tables',    icon: TablesIcon   },
  { path: '/staff',    label: 'Staff',     icon: StaffIcon    },
  { path: '/reports',  label: 'Reports',   icon: ReportsIcon  },
]

// ─── Logo Component ───────────────────────────────────────────
const SidebarLogo = ({ collapsed, onClose }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 20px 20px',
    borderBottom: '1px solid #ffffff08',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Icon — hamesha dikhega */}
      <div style={{
        width: 32, height: 32, flexShrink: 0,
        background: 'linear-gradient(135deg, #f97316, #ea580c)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 16px #f9731640',
      }}>
        <MenuIcon size={16} />
      </div>

      {/* Text — sirf expanded mein dikhega */}
      {!collapsed && (
        <div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 16,
            color: '#f4f4f5', letterSpacing: '-0.3px',
          }}>
            DineStream
          </div>
          <div style={{ fontSize: 10, color: '#52525b', marginTop: 1 }}>
            POS System
          </div>
        </div>
      )}
    </div>

    {/* Mobile-only close (X) button */}
    <button
      onClick={onClose}
      className="sidebar-mobile-close"
      style={{
        display: 'none',
        width: 28, height: 28,
        background: '#18181b', border: '1px solid #ffffff0a',
        borderRadius: 6, cursor: 'pointer',
        color: '#71717a', fontSize: 14,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      ✕
    </button>
  </div>
)

// ─── Single Nav Item ──────────────────────────────────────────
const NavItem = ({ link, collapsed, onNavigate }) => {
  const Icon = link.icon

  return (
    <NavLink
      to={link.path}
      end={link.path === '/'}
      style={{ textDecoration: 'none' }}
      onClick={onNavigate}
    >
      {({ isActive }) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '11px 0' : '11px 14px',
          margin: '2px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
          position: 'relative',
          background: isActive ? '#f9731615' : 'transparent',
          border: `1px solid ${isActive ? '#f9731625' : 'transparent'}`,
          transition: 'all 0.15s ease',
        }}
          onMouseEnter={e => {
            if (!isActive) e.currentTarget.style.background = '#ffffff08'
          }}
          onMouseLeave={e => {
            if (!isActive) e.currentTarget.style.background = 'transparent'
          }}
        >
          {/* Icon */}
          <div style={{
            color: isActive ? '#f97316' : '#52525b',
            flexShrink: 0,
            transition: 'color 0.15s',
          }}>
            <Icon size={18} />
          </div>

          {/* Label — sirf expanded mein */}
          {!collapsed && (
            <span style={{
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#f4f4f5' : '#71717a',
              transition: 'color 0.15s',
              flex: 1,
            }}>
              {link.label}
            </span>
          )}

          {/* Badge — sirf expanded mein */}
          {!collapsed && link.badge && (
            <span style={{
              background: '#f97316',
              color: 'white',
              fontSize: 10, fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 20,
              minWidth: 18,
              textAlign: 'center',
            }}>
              {link.badge}
            </span>
          )}

          {/* Active left bar indicator */}
          {isActive && (
            <div style={{
              position: 'absolute',
              left: -12, top: '50%',
              transform: 'translateY(-50%)',
              width: 3, height: 16,
              background: '#f97316',
              borderRadius: '0 3px 3px 0',
            }}/>
          )}
        </div>
      )}
    </NavLink>
  )
}

// ════════════════════════════════════════════════════════
// MAIN SIDEBAR COMPONENT
// ════════════════════════════════════════════════════════
const Sidebar = ({ collapsed, onToggle, mobileOpen = false, onCloseMobile }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { restaurant } = useRestaurant()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div
        className={`app-sidebar ${mobileOpen ? 'app-sidebar-open' : ''}`}
        style={{
          width: collapsed ? 64 : 220,
          minHeight: '100vh',
          background: '#111113',
          borderRight: '1px solid #ffffff08',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease, transform 0.25s ease',
          flexShrink: 0,
          position: 'relative',
        }}
      >

        {/* Logo */}
        <SidebarLogo collapsed={collapsed} onClose={onCloseMobile} />

        {/* Nav Links */}
        <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
          {NAV_LINKS.map(link => (
            <NavItem key={link.path} link={link} collapsed={collapsed} onNavigate={onCloseMobile} />
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ borderTop: '1px solid #ffffff08', paddingBottom: 8 }}>

          {/* Settings */}
          <NavItem
            link={{ path: '/settings', label: 'Settings', icon: SettingsIcon }}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />

          {/* User info */}
          {!collapsed && (
            <div style={{
              margin: '8px 12px',
              padding: '10px 12px',
              background: '#18181b',
              border: '1px solid #ffffff08',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: '#f4f4f5',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.name || 'Admin'}
                </div>
                <div style={{ fontSize: 10, color: '#52525b', textTransform: 'capitalize' }}>
                  {user?.role || 'admin'}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: 'none',
                  color: '#52525b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  padding: 4, borderRadius: 4,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
                title="Logout"
              >
                <LogoutIcon size={14} />
              </button>
            </div>
          )}

          {/* Collapsed logout */}
          {collapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%', background: 'none', border: 'none',
                color: '#52525b', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
            >
              <LogoutIcon size={16} />
            </button>
          )}
        </div>

        {/* Collapse Toggle Button — hidden on mobile (drawer uses X close instead) */}
        <button
          onClick={onToggle}
          className="sidebar-collapse-toggle"
          style={{
            position: 'absolute',
            top: 28, right: -12,
            width: 24, height: 24,
            background: '#1c1c20',
            border: '1px solid #ffffff15',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#71717a',
            transition: 'all 0.15s',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f97316'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.borderColor = '#f97316'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1c1c20'
            e.currentTarget.style.color = '#71717a'
            e.currentTarget.style.borderColor = '#ffffff15'
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Add Order Button — sidebar bottom (expanded) */}
        {!collapsed && (
          <div style={{ padding: '0 12px 10px' }}>
            <button
              onClick={() => { navigate('/orders/new'); onCloseMobile?.() }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#f97316',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontSize: 13,
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Order
            </button>
          </div>
        )}

        {/* Collapsed — just icon */}
        {collapsed && (
          <div style={{ padding: '0 12px 10px' }}>
            <button
              onClick={() => { navigate('/orders/new'); onCloseMobile?.() }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f97316',
                border: 'none',
                borderRadius: 10,
                padding: '10px 0',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* On mobile, the sidebar is always rendered at its expanded width
             and slides in/out via transform — collapsed mode is irrelevant here. */
          .app-sidebar {
            width: 240px !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%) !important;
            transition: transform 0.25s ease !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.5);
            z-index: 50;
          }
          .app-sidebar.app-sidebar-open {
            transform: translateX(0) !important;
          }
          .sidebar-collapse-toggle {
            display: none !important;
          }
          .sidebar-mobile-close {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}

export default Sidebar