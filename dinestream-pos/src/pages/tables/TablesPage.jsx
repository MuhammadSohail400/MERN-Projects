import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useTables from '../../hooks/useTables'
import TableCard from './TableCard'

const FILTER_TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'available', label: 'Available' },
  { key: 'occupied',  label: 'Occupied'  },
  { key: 'reserved',  label: 'Reserved'  },
]

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, color, bgIcon }) => (
  <div className="
    bg-[#1a1208] border border-white/8
    rounded-xl p-5 flex items-end
    justify-between overflow-hidden relative
    min-h-27.5
  ">
    {/* Content */}
    <div className="relative z-10">
      <p className="text-[11px] font-semibold text-zinc-500
        uppercase tracking-widest mb-3">
        {label}
      </p>
      <p className={`font-heading text-5xl font-bold ${color} leading-none`}>
        {String(value).padStart(2, '0')}
      </p>
    </div>

    {/* Background icon */}
    <div className="absolute right-4 bottom-2 opacity-10 text-7xl select-none">
      {bgIcon}
    </div>
  </div>
)

// ─── Skeleton ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="
    bg-[#1a1208] border border-white/5
    rounded-xl h-36 animate-pulse
  "/>
)

// ════════════════════════════════════════════════════════
// TABLES PAGE
// ════════════════════════════════════════════════════════
const TablesPage = () => {
  const navigate = useNavigate()
  const { tables, isLoading, updateTableStatus, selectTable } = useTables()

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeFloor,  setActiveFloor]  = useState('all')

  // Floors list
  const floors = useMemo(() => {
    const nums = [...new Set(tables.map(t => t.floor))].sort()
    return ['all', ...nums]
  }, [tables])

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchStatus = activeFilter === 'all' || t.status === activeFilter
      const matchFloor  = activeFloor  === 'all' || t.floor  === activeFloor
      return matchStatus && matchFloor
    })
  }, [tables, activeFilter, activeFloor])

  // Stats
  const stats = useMemo(() => ({
    total:     tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied:  tables.filter(t => t.status === 'occupied').length,
    reserved:  tables.filter(t => t.status === 'reserved').length,
  }), [tables])

  const handleStatusChange = useCallback((id, status) => {
    updateTableStatus(id, status)
  }, [updateTableStatus])

  const handleSelect = useCallback((table) => {
    selectTable(table)
  }, [selectTable])

  // Tables per floor section
  const floorSections = useMemo(() => {
    return floors
      .filter(f => f !== 'all')
      .map(floor => ({
        floor,
        tables: filteredTables.filter(t => t.floor === floor),
      }))
      .filter(s => s.tables.length > 0)
  }, [floors, filteredTables])

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold text-zinc-100 tracking-tight">
            Floor Map
          </h2>
          <p className="text-sm mt-1.5">
            <span className="text-orange-400 font-medium">
              {stats.occupied} occupied
            </span>
            <span className="text-zinc-600 mx-1.5">·</span>
            <span className="text-green-400 font-medium">
              {stats.available} available
            </span>
            <span className="text-zinc-600 mx-1.5">·</span>
            <span className="text-yellow-400 font-medium">
              {stats.reserved} reserved
            </span>
          </p>
        </div>

        <button
  onClick={() => navigate('/orders/new')}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f97316',
    border: 'none',
    borderRadius: 12,
    padding: '11px 20px',
    fontSize: 13,
    fontWeight: 600,
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 0 0 1px #f97316',  // ← clean border, no glow
    transition: 'all 0.15s',
  }}
  onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
  onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
  New Order
</button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Tables"
          value={stats.total}
          color="text-zinc-100"
          bgIcon="🪑"
        />
        <StatCard
          label="Available"
          value={stats.available}
          color="text-green-400"
          bgIcon="✓"
        />
        <StatCard
          label="Occupied"
          value={stats.occupied}
          color="text-orange-400"
          bgIcon="🍴"
        />
        <StatCard
          label="Reserved"
          value={stats.reserved}
          color="text-yellow-400"
          bgIcon="📅"
        />
      </div>

      {/* ── Filter Bar ── */}
      {/* ── Filter Bar ── */}
<div className="flex items-center justify-between flex-wrap gap-3">

  {/* Left — filters */}
  <div className="flex items-center gap-2 flex-wrap">

    {/* Status pills */}
    {FILTER_TABS.map(tab => (
      <button
        key={tab.key}
        onClick={() => setActiveFilter(tab.key)}
        style={{
          padding: '8px 18px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: activeFilter === tab.key ? 600 : 400,
          border: `1px solid ${activeFilter === tab.key ? '#f97316' : '#3f3f46'}`,
          background: activeFilter === tab.key ? '#f97316' : 'transparent',
          color: activeFilter === tab.key ? '#ffffff' : '#a1a1aa',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          if (activeFilter !== tab.key) {
            e.currentTarget.style.borderColor = '#71717a'
            e.currentTarget.style.color = '#f4f4f5'
          }
        }}
        onMouseLeave={e => {
          if (activeFilter !== tab.key) {
            e.currentTarget.style.borderColor = '#3f3f46'
            e.currentTarget.style.color = '#a1a1aa'
          }
        }}
      >
        {tab.label}
      </button>
    ))}

    {/* Divider */}
    <div style={{
      width: 1, height: 24,
      background: '#3f3f46',
      margin: '0 4px',
    }}/>

    {/* Floor pills */}
    {floors.map(floor => (
      <button
        key={floor}
        onClick={() => setActiveFloor(floor)}
        style={{
          padding: '8px 18px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: activeFloor === floor ? 600 : 400,
          border: `1px solid ${activeFloor === floor ? '#71717a' : '#3f3f46'}`,
          background: activeFloor === floor ? '#3f3f46' : 'transparent',
          color: activeFloor === floor ? '#f4f4f5' : '#a1a1aa',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          if (activeFloor !== floor) {
            e.currentTarget.style.borderColor = '#71717a'
            e.currentTarget.style.color = '#f4f4f5'
          }
        }}
        onMouseLeave={e => {
          if (activeFloor !== floor) {
            e.currentTarget.style.borderColor = '#3f3f46'
            e.currentTarget.style.color = '#a1a1aa'
          }
        }}
      >
        {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
      </button>
    ))}
  </div>

  {/* Right — Legend */}
  <div className="flex items-center gap-4">
    {[
      { dot: '#f97316', label: 'Occupied'  },
      { dot: '#22c55e', label: 'Available' },
      { dot: '#eab308', label: 'Reserved'  },
    ].map(item => (
      <div key={item.label} className="flex items-center gap-1.5">
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: item.dot,
        }}/>
        <span className="text-xs text-zinc-500">{item.label}</span>
      </div>
    ))}
  </div>
</div>

      {/* ── Floor Sections ── */}
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i}/>)}
        </div>
      ) : (
        floorSections.map(({ floor, tables: floorTables }) => (
          <div key={floor}>

            {/* Floor header */}
            <div className="flex items-center justify-between mb-4">
              <div className="
                bg-zinc-800 border border-white/10
                rounded-md px-3 py-1
                text-[11px] font-bold text-zinc-300
                tracking-widest uppercase
              ">
                FLOOR {floor}
              </div>
              <span className="text-xs text-zinc-600">
                {floorTables.length} tables active
              </span>
            </div>

            {/* Tables grid */}
            <div className="
              grid gap-3 mb-8
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-4
              xl:grid-cols-5
            ">
              {floorTables.map(table => (
                <TableCard
                  key={table.id}
                  table={table}
                  onStatusChange={handleStatusChange}
                  onSelect={handleSelect}
                />
              ))}
            </div>

          </div>
        ))
      )}

      {/* Empty state */}
      {!isLoading && filteredTables.length === 0 && (
        <div className="
          flex flex-col items-center justify-center
          py-20 gap-4
          bg-[#1a1208] border border-white/5
          rounded-2xl
        ">
          <span className="text-5xl">🪑</span>
          <p className="font-heading text-lg font-semibold text-zinc-100">
            No tables found
          </p>
          <p className="text-sm text-zinc-600">
            Try changing the filter
          </p>
        </div>
      )}
    </div>
  )
}

export default TablesPage