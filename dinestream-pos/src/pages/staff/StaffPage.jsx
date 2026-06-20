import { useState, useMemo, useCallback } from 'react'
import useStaff from '../../hooks/useStaff'
import StaffModal from './StaffModal'

// ─── Config ───────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:   { label: 'Admin',   bg: '#f9731618', color: '#f97316', border: '#f9731630' },
  manager: { label: 'Manager', bg: '#3b82f618', color: '#3b82f6', border: '#3b82f630' },
  waiter:  { label: 'Waiter',  bg: '#22c55e18', color: '#22c55e', border: '#22c55e30' },
  chef:    { label: 'Chef',    bg: '#a855f718', color: '#a855f7', border: '#a855f730' },
}

const STATUS_CONFIG = {
  on_duty:  { label: 'On Duty',  color: '#22c55e', dot: '#22c55e'  },
  on_break: { label: 'On Break', color: '#eab308', dot: '#eab308'  },
  off_duty: { label: 'Off Duty', color: '#ef4444', dot: '#ef4444'  },
}

const ROLE_TABS = ['all', 'admin', 'manager', 'waiter', 'chef']

// ─── Avatar ───────────────────────────────────────────────────
const Avatar = ({ name, color }) => (
  <div style={{
    width: 38, height: 38, borderRadius: '50%',
    background: color || '#f97316',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
    color: 'white', flexShrink: 0,
    fontFamily: 'Space Grotesk, sans-serif',
  }}>
    {name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
  </div>
)

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: '#1a1208',
    border: '1px solid #2a1f10',
    borderRadius: 12,
    padding: '18px 20px',
    display: 'flex', alignItems: 'flex-end',
    justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden',
    minHeight: 100,
  }}>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={{
        fontSize: 10, fontWeight: 700,
        color: '#52525b', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 10,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 40, fontWeight: 700,
        color: color, lineHeight: 1,
      }}>
        {String(value).padStart(2, '0')}
      </p>
    </div>
    <div style={{
      position: 'absolute', right: 16, bottom: 8,
      fontSize: 52, opacity: 0.12, userSelect: 'none',
      lineHeight: 1,
    }}>
      {icon}
    </div>
  </div>
)

// ─── Progress Bar ─────────────────────────────────────────────
const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 13, fontWeight: 600, color: '#f4f4f5',
        minWidth: 60,
      }}>
        {value} orders
      </span>
      <div style={{ flex: 1, height: 3, background: '#27272a', borderRadius: 99 }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color || '#f97316',
          borderRadius: 99,
          transition: 'width 0.3s',
        }}/>
      </div>
      <span style={{ fontSize: 11, color: '#52525b', minWidth: 32 }}>
        {Math.round(pct)}%
      </span>
    </div>
  )
}

// ─── Skeleton Row ─────────────────────────────────────────────
const SkeletonRow = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1.5fr 80px',
    gap: 16, padding: '16px 20px',
    borderBottom: '1px solid #1a1a1a',
  }}>
    {[200, 80, 90, 100, 140, 60].map((w, i) => (
      <div key={i} style={{
        height: 14, width: w,
        background: '#27272a', borderRadius: 4,
        animation: 'shimmer 1.5s infinite',
      }}/>
    ))}
    <style>{`@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
  </div>
)

// ════════════════════════════════════════════════════════
// STAFF PAGE
// ════════════════════════════════════════════════════════
const StaffPage = () => {
  const { staff, isLoading, addStaff, editStaff, deleteStaff } = useStaff()

  const [activeRole,  setActiveRole]  = useState('all')
  const [search,      setSearch]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editMember,  setEditMember]  = useState(null)

  // 🧠 useMemo — filtered staff
  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchRole   = activeRole === 'all' || s.role === activeRole
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase())
      return matchRole && matchSearch
    })
  }, [staff, activeRole, search])

  // 🧠 useMemo — stats
  const stats = useMemo(() => ({
    total:    staff.length,
    onDuty:   staff.filter(s => s.status === 'on_duty').length,
    onBreak:  staff.filter(s => s.status === 'on_break').length,
    offDuty:  staff.filter(s => s.status === 'off_duty').length,
  }), [staff])

  // 🧠 useCallback — handlers
  const handleEdit = useCallback((member) => {
    setEditMember(member)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (window.confirm('Remove this staff member?')) deleteStaff(id)
  }, [deleteStaff])

  const handleSave = useCallback((data) => {
    if (editMember) editStaff(data)
    else addStaff(data)
  }, [editMember, editStaff, addStaff])

  const handleAdd = useCallback(() => {
    setEditMember(null)
    setModalOpen(true)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 26, fontWeight: 700,
            color: '#f4f4f5', letterSpacing: '-0.02em',
          }}>
            Staff Management
          </h2>
          <p style={{ fontSize: 13, marginTop: 5, display: 'flex', gap: 8 }}>
            <span style={{ color: '#71717a' }}>{stats.total} total</span>
            <span style={{ color: '#22c55e' }}>● {stats.onDuty} on duty</span>
            <span style={{ color: '#eab308' }}>● {stats.onBreak} on break</span>
            <span style={{ color: '#ef4444' }}>● {stats.offDuty} off duty</span>
          </p>
        </div>

        <button
          onClick={handleAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f97316', border: 'none',
            borderRadius: 10, padding: '11px 18px',
            fontSize: 13, fontWeight: 600,
            color: 'white', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Add Staff Member
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Total Staff" value={stats.total}   color="#f4f4f5" icon="👥" />
        <StatCard label="On Duty"     value={stats.onDuty}  color="#22c55e" icon="✓"  />
        <StatCard label="On Break"    value={stats.onBreak} color="#eab308" icon="⏸"  />
        <StatCard label="Off Duty"    value={stats.offDuty} color="#ef4444" icon="✗"  />
      </div>

      {/* ── Filter + Search ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

        {/* Role tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {ROLE_TABS.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13, fontWeight: activeRole === role ? 600 : 400,
                border: `1px solid ${activeRole === role ? '#f97316' : '#3f3f46'}`,
                background: activeRole === role ? '#f97316' : 'transparent',
                color: activeRole === role ? 'white' : '#a1a1aa',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {role === 'all' ? 'All Staff' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: '#52525b', fontSize: 14,
          }}>
            🔍
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff..."
            style={{
              background: '#1a1208',
              border: '1px solid #2a1f10',
              borderRadius: 10, padding: '9px 12px 9px 36px',
              fontSize: 13, color: '#f4f4f5',
              outline: 'none', width: 220,
              fontFamily: 'DM Sans, sans-serif',
            }}
            onFocus={e => e.target.style.borderColor = '#f97316'}
            onBlur={e => e.target.style.borderColor = '#2a1f10'}
          />
        </div>
      </div>

      {/* ── Staff Table ── */}
      <div style={{
        background: '#1a1208',
        border: '1px solid #2a1f10',
        borderRadius: 14, overflow: 'hidden',
      }}>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1.5fr 80px',
          gap: 16, padding: '12px 20px',
          borderBottom: '1px solid #27272a',
          background: '#141008',
        }}>
          {['STAFF MEMBER', 'ROLE', 'STATUS', 'SHIFT', 'ORDERS TODAY', 'ACTION'].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 700,
              color: '#52525b', letterSpacing: '0.1em',
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {isLoading
          ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i}/>)
          : filteredStaff.length === 0
            ? (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
              }}>
                <span style={{ fontSize: 36 }}>👥</span>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 15, fontWeight: 600,
                  color: '#f4f4f5', marginTop: 12,
                }}>
                  No staff found
                </p>
                <p style={{ fontSize: 13, color: '#52525b', marginTop: 6 }}>
                  {search ? 'Try different search' : 'Add your first staff member'}
                </p>
              </div>
            )
            : filteredStaff.map((member, i) => {
              const role   = ROLE_CONFIG[member.role]   || ROLE_CONFIG.waiter
              const status = STATUS_CONFIG[member.status] || STATUS_CONFIG.off_duty
              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1.5fr 80px',
                    gap: 16, padding: '16px 20px',
                    borderBottom: i < filteredStaff.length - 1
                      ? '1px solid #1f1710' : 'none',
                    transition: 'background 0.15s',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1f150a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Staff Member */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={member.name} color={member.avatarColor}/>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>
                        {member.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#52525b', marginTop: 1 }}>
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <span style={{
                      background: role.bg,
                      color: role.color,
                      border: `1px solid ${role.border}`,
                      borderRadius: 6, padding: '4px 10px',
                      fontSize: 11, fontWeight: 600,
                    }}>
                      {role.label}
                    </span>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: status.dot,
                      boxShadow: `0 0 6px ${status.dot}`,
                    }}/>
                    <span style={{ fontSize: 13, color: status.color, fontWeight: 500 }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Shift */}
                  <div>
                    <p style={{ fontSize: 13, color: '#f4f4f5', fontWeight: 500 }}>
                      {member.shift}
                    </p>
                    <p style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
                      {member.startedAgo}
                    </p>
                  </div>

                  {/* Orders Today */}
                  <ProgressBar
                    value={member.ordersToday}
                    max={member.maxOrders}
                    color={role.color}
                  />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(member)}
                      style={{
                        width: 30, height: 30,
                        background: '#27272a',
                        border: '1px solid #3f3f46',
                        borderRadius: 6, cursor: 'pointer',
                        color: '#71717a', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#f4f4f5'
                        e.currentTarget.style.borderColor = '#71717a'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#71717a'
                        e.currentTarget.style.borderColor = '#3f3f46'
                      }}
                      title="Edit"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(member.id)}
                      style={{
                        width: 30, height: 30,
                        background: '#27272a',
                        border: '1px solid #3f3f46',
                        borderRadius: 6, cursor: 'pointer',
                        color: '#71717a', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#ef4444'
                        e.currentTarget.style.borderColor = '#ef4444'
                        e.currentTarget.style.background = '#ef444415'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#71717a'
                        e.currentTarget.style.borderColor = '#3f3f46'
                        e.currentTarget.style.background = '#27272a'
                      }}
                      title="Delete"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
        }

        {/* Footer */}
        {!isLoading && filteredStaff.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid #27272a',
          }}>
            <span style={{ fontSize: 12, color: '#52525b' }}>
              Showing {filteredStaff.length} of {staff.length} staff members
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Previous', 'Next'].map(btn => (
                <button
                  key={btn}
                  style={{
                    padding: '6px 14px',
                    background: 'transparent',
                    border: '1px solid #3f3f46',
                    borderRadius: 6, cursor: 'pointer',
                    fontSize: 12, color: '#71717a',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f4f4f5'}
                  onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <StaffModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditMember(null)
        }}
        onSave={handleSave}
        editMember={editMember}
      />
    </div>
  )
}

export default StaffPage