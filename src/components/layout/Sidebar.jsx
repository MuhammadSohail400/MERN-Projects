
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";  // useLocation add karo

const NAV_ITEMS = [
  {
    path: "/",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: "/employees",
    label: "Employees",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: "/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
];
 // useLocation add karo

export default function Sidebar() {
  const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

   return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: "none",  // CSS mein mobile pe show karenge
          position: "fixed", top: "14px", left: "16px",
          zIndex: 50, background: "#fff",
          border: "1px solid var(--color-border)",
          borderRadius: "8px", width: "36px", height: "36px",
          placeItems: "center", cursor: "pointer",
        }}
        className="mobile-menu-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ── Overlay — mobile mein sidebar ke peeche ── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            display: "none",
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 39,
          }}
          className="mobile-overlay"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Close button — mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="sidebar-close"
          style={{
            display: "none",
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none",
            cursor: "pointer", padding: "4px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="nav-brand">
          <div className="nav-logo">NexusHR</div>
          <div className="nav-sub">Management Portal</div>
        </div>

        <nav className="nav-items">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsOpen(false)}
              className={() => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);
                return `nav-item ${isActive ? "active" : ""}`;
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-bottom">
          <button className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}