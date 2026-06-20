import { memo, useCallback, useState } from 'react'

const STATUS_CONFIG = {
  available: {
    topBorder:  'border-t-green-500',
    iconBg:     'bg-green-500/20',
    iconColor:  'text-green-400',
    textColor:  'text-green-400',
    dotColor:   'bg-green-500',
    label:      'Available',
  },
  occupied: {
    topBorder:  'border-t-orange-500',
    iconBg:     'bg-orange-500/20',
    iconColor:  'text-orange-400',
    textColor:  'text-orange-400',
    dotColor:   'bg-orange-500',
    label:      'Occupied',
  },
  reserved: {
    topBorder:  'border-t-yellow-500',
    iconBg:     'bg-yellow-500/20',
    iconColor:  'text-yellow-400',
    textColor:  'text-yellow-400',
    dotColor:   'bg-yellow-500',
    label:      'Reserved',
  },
}

// ─── Chair SVG Icon ───────────────────────────────────────────
const ChairIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 20v-6a4 4 0 014-4h8a4 4 0 014 4v6M7 20v2M17 20v2M4 14h16"/>
    <path d="M8 10V6a2 2 0 012-2h4a2 2 0 012 2v4"/>
  </svg>
)

const TableCard = memo(({ table, onStatusChange, onSelect }) => {

  const [showMenu, setShowMenu] = useState(false)
  const s = STATUS_CONFIG[table.status]

  const handleCardClick = useCallback(() => {
    onSelect(table)
    setShowMenu(prev => !prev)
  }, [table, onSelect])

  const handleStatusChange = useCallback((newStatus) => {
    onStatusChange(table.id, newStatus)
    setShowMenu(false)
  }, [table.id, onStatusChange])

  return (
    <div className="relative">

      {/* ── Card ── */}
      <div
        onClick={handleCardClick}
        className={`
          relative
          bg-[#1a1208] border border-white/8
          border-t-4 ${s.topBorder}
          rounded-xl p-4
          cursor-pointer select-none
          transition-all duration-200
          hover:border-white/15 hover:-translate-y-0.5
          hover:shadow-xl hover:shadow-black/40
          min-h-35
          flex flex-col justify-between
        `}
      >
        {/* Top row — icon + label */}
        <div className="flex items-start justify-between mb-3">

          {/* Chair icon */}
          <div className={`
            w-9 h-9 rounded-lg ${s.iconBg}
            flex items-center justify-center
            shrink-0
          `}>
            <ChairIcon className={`w-5 h-5 ${s.iconColor}`} />
          </div>

          {/* Table label */}
          <span className="
            font-heading text-xl font-bold
            text-zinc-100 tracking-tight
          ">
            {table.label}
          </span>
        </div>

        {/* Middle — waiter / ready text */}
        <div className="flex-1">
          {table.status === 'occupied' && table.waiter && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Waiter: {table.waiter}</span>
            </div>
          )}

          {table.status === 'available' && (
            <div className="flex items-center gap-1.5 text-xs text-green-400/80 mb-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>
                {table.zone ? table.zone : 'Ready for guests'}
              </span>
            </div>
          )}

          {table.status === 'reserved' && table.waiter && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Waiter: {table.waiter}</span>
            </div>
          )}

          {table.zone && table.status !== 'available' && (
            <div className="text-xs text-zinc-500 mb-1">
              {table.zone}
            </div>
          )}
        </div>

        {/* Bottom — capacity + duration */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>
            {table.capacity} seats
            {table.duration && ` · ${table.duration}`}
          </span>
        </div>
      </div>
      
      {/* ── Status Dropdown ── */}
{showMenu && (
  <>
    <div
      className="fixed inset-0 z-10"
      onClick={() => setShowMenu(false)}
    />

    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      background: '#1c1c1c',
      border: '1px solid #3f3f46',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      minWidth: 160,
    }}>
      <p style={{
        fontSize: 10, color: '#52525b',
        fontWeight: 600, padding: '10px 14px 6px',
        letterSpacing: '0.08em',
        borderBottom: '1px solid #27272a',
      }}>
        CHANGE STATUS
      </p>

      {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
        const isActive = table.status === status
        return (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              background: isActive ? '#27272a' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = '#27272a'
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#f4f4f5' : '#a1a1aa',
            }}>
              {cfg.label}
            </span>
            {isActive && (
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="#a1a1aa" strokeWidth="2.5"
                strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        )
      })}
    </div>
  </>
)}
    </div>
  )
})

TableCard.displayName = 'TableCard'
export default TableCard