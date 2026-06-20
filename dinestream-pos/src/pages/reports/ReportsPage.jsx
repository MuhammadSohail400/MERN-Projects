import { useState, useMemo, useCallback } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../utils/formatters'

// ─── Mock Data ────────────────────────────────────────────────
const REVENUE_DATA = [
  { day: 'Mon', revenue: 198000 },
  { day: 'Tue', revenue: 245000 },
  { day: 'Wed', revenue: 189000 },
  { day: 'Thu', revenue: 312000 },
  { day: 'Fri', revenue: 398000 },
  { day: 'Sat', revenue: 445000 },
  { day: 'Sun', revenue: 284500 },
]

const HOURLY_DATA = [
  { hour: '10am', orders: 4  },
  { hour: '11am', orders: 8  },
  { hour: '12pm', orders: 18 },
  { hour: '1pm',  orders: 24 },
  { hour: '2pm',  orders: 32 },
  { hour: '3pm',  orders: 22 },
  { hour: '4pm',  orders: 28 },
  { hour: '5pm',  orders: 35 },
  { hour: '6pm',  orders: 42 },
  { hour: '7pm',  orders: 38 },
  { hour: '8pm',  orders: 30 },
  { hour: '10pm', orders: 18 },
]

const CATEGORY_DATA = [
  { name: 'Burgers',  value: 35, color: '#f97316' },
  { name: 'Drinks',   value: 22, color: '#3b82f6' },
  { name: 'Pizza',    value: 18, color: '#22c55e' },
  { name: 'Mains',    value: 15, color: '#6b7280' },
  { name: 'Desserts', value: 10, color: '#71717a' },
]

const TOP_ITEMS = [
  { rank: 1, emoji: '🍔', name: 'Smash Burger', category: 'Burgers', orders: 1420, revenue: 426000, trend: +18 },
  { rank: 2, emoji: '🍕', name: 'Margherita',   category: 'Pizza',   orders: 840,  revenue: 210000, trend: +12 },
  { rank: 3, emoji: '🥤', name: 'Choc Shake',   category: 'Drinks',  orders: 620,  revenue: 93000,  trend: +24 },
  { rank: 4, emoji: '🥩', name: 'BBQ Platter',  category: 'Mains',   orders: 410,  revenue: 184500, trend: -5  },
  { rank: 5, emoji: '🍟', name: 'Crispy Fries', category: 'Sides',   orders: 390,  revenue: 58500,  trend: +31 },
]

const STAFF_PERF = [
  { name: 'Ahmed Khan', role: 'Manager', orders: 142, max: 160, color: '#f97316', initials: 'AK', avatarBg: '#f97316' },
  { name: 'Sara Malik', role: 'Waiter',  orders: 118, max: 160, color: '#3b82f6', initials: 'SM', avatarBg: '#3b82f6' },
  { name: 'Bilal Raza', role: 'Chef',    orders: 95,  max: 160, color: '#22c55e', initials: 'BR', avatarBg: '#22c55e' },
  { name: 'Zoya Ali',   role: 'Waiter',  orders: 76,  max: 160, color: '#a855f7', initials: 'ZA', avatarBg: '#a855f7' },
]

const DATE_TABS = ['Today', '7 Days', '30 Days']

// ─── Reusable Card ────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#130e06] border border-[#2a1f10] rounded-xl p-5 ${className}`}>
    {children}
  </div>
)

// ─── KPI Card ─────────────────────────────────────────────────
const KpiCard = ({ label, value, trend, trendLabel, icon, isText }) => (
  <div className="bg-[#130e06] border border-[#2a1f10] rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
    <div className="flex items-start justify-between">
      <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
        {label}
      </p>
      <div className="w-9 h-9 bg-[#1f1509] border border-[#2a1f10] rounded-lg flex items-center justify-center text-base">
        {icon}
      </div>
    </div>
    <div>
      <p className={`font-heading font-bold leading-none ${isText ? 'text-2xl text-zinc-100' : 'text-3xl text-orange-400'}`}>
        {value}
      </p>
      {trend !== undefined && (
        <p className={`text-[12px] font-semibold mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}% from last week
        </p>
      )}
      {trendLabel && (
        <p className="text-[12px] text-zinc-500 mt-1.5">{trendLabel}</p>
      )}
    </div>
  </div>
)

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1c1c1c',
      border: '1px solid #3f3f46',
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <p style={{
        fontSize: 11, color: '#3b82f6', fontWeight: 700,
        marginBottom: 4, background: '#1d4ed820',
        padding: '1px 6px', borderRadius: 4,
        display: 'inline-block',
      }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#f97316', marginTop: 2 }}>
        {payload[0]?.name === 'revenue'
          ? formatCurrency(payload[0].value)
          : `${payload[0]?.value} orders`
        }
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════
// REPORTS PAGE
// ════════════════════════════════════════════════════════
const ReportsPage = () => {

  // ✅ Fix 1 — activeTab actually use ho raha hai
  const [activeTab, setActiveTab] = useState('7 Days')

  // ✅ Fix 2 — useMemo for performance
  const totalRevenue = useMemo(() =>
    REVENUE_DATA.reduce((s, d) => s + d.revenue, 0)
  , [])

  // ✅ Fix 2 — maxOrders useMemo mein
  const maxOrders = useMemo(() =>
    Math.max(...HOURLY_DATA.map(d => d.orders))
  , [])

  // ✅ Fix 8 — dynamic KPI values
  const totalOrders = useMemo(() =>
    TOP_ITEMS.reduce((sum, item) => sum + item.orders, 0)
  , [])

  const avgOrderValue = useMemo(() =>
    Math.round(totalRevenue / totalOrders)
  , [totalRevenue, totalOrders])

  // ✅ Fix 3 — Export CSV working
  const exportCSV = useCallback(() => {
    const csv =
      'Day,Revenue\n' +
      REVENUE_DATA.map(r => `${r.day},${r.revenue}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'dinestream-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div className="flex flex-col gap-5 font-body max-w-350">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-zinc-100 tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-[13px] text-zinc-500 mt-1">
            Track your restaurant performance across all outlets.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* ✅ Fix 1 — Date tabs working */}
          <div className="flex items-center gap-1 bg-[#1a1208] border border-[#2a1f10] rounded-xl p-1">
            {DATE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: activeTab === tab ? 600 : 400,
                  background: activeTab === tab ? '#f97316' : 'transparent',
                  color: activeTab === tab ? 'white' : '#71717a',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ✅ Fix 3 — Export CSV functional */}
          <button
            onClick={exportCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px',
              background: 'transparent',
              border: '1px solid #3f3f46',
              borderRadius: 10,
              fontSize: 13, fontWeight: 500,
              color: '#a1a1aa', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#71717a'
              e.currentTarget.style.color = '#f4f4f5'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3f3f46'
              e.currentTarget.style.color = '#a1a1aa'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>

          {/* Custom Range */}
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px',
              background: '#f97316',
              border: 'none',
              borderRadius: 10,
              fontSize: 13, fontWeight: 600,
              color: 'white', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
            onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            Custom Range
          </button>
        </div>
      </div>

      {/* ── KPI Cards — ✅ Fix 5 responsive + Fix 8 dynamic ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          trend={12.5}
          icon="📈"
        />
        <KpiCard
          label="Orders"
          value={totalOrders.toLocaleString()}
          trend={8.3}
          icon="🧾"
        />
        <KpiCard
          label="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          trend={3.1}
          icon="💳"
        />
        <KpiCard
          label="Top Category"
          value="Burgers"
          trendLabel="35% of total sales"
          icon="🍔"
          isText
        />
      </div>

      {/* ── Revenue Trend ── */}
      <Card>
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <p className="font-heading text-base font-bold text-zinc-100">
              Revenue Trend
            </p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Weekly performance overview
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-lg font-bold text-orange-400">
              {formatCurrency(totalRevenue)} Total
            </p>
            <p className="text-[11px] text-zinc-600 mt-0.5">Oct 16 – Oct 22</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#2a1f10" vertical={false}/>
            <XAxis
              dataKey="day"
              tick={{ fill: '#52525b', fontSize: 11 }}
              axisLine={false} tickLine={false} dy={8}
            />
            <YAxis
              tick={{ fill: '#52525b', fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => v === 0 ? '0k' : `${v/1000}k`}
              ticks={[0, 150000, 300000, 450000, 600000]}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#ffffff30', strokeWidth: 1 }}
            />
            <Area
              type="monotone" dataKey="revenue"
              stroke="#f97316" strokeWidth={2.5}
              fill="url(#revGrad)" dot={false}
              activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Peak Hours + Category — ✅ Fix 5 responsive ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Peak Hours */}
        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-1">Peak Hours</p>
          <p className="text-[12px] text-zinc-500 mb-5">Order volume throughout the day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={HOURLY_DATA} barSize={18}>
              <CartesianGrid strokeDasharray="4 4" stroke="#2a1f10" vertical={false}/>
              <XAxis
                dataKey="hour"
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                {/* ✅ Fix 2 — maxOrders from useMemo */}
                {HOURLY_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.orders === maxOrders ? '#f97316' : '#3b82f6'}
                    fillOpacity={entry.orders === maxOrders ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-1">Category Breakdown</p>
          <p className="text-[12px] text-zinc-500 mb-4">Revenue share by category</p>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={75}
                    paddingAngle={2} dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {CATEGORY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color}/>
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[11px] text-zinc-500">Top</p>
                <p className="font-heading text-xl font-bold text-zinc-100">35%</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {CATEGORY_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }}/>
                    <span className="text-[13px] text-zinc-400">{item.name}</span>
                  </div>
                  <span className="font-heading text-[13px] font-bold text-zinc-100">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Top Items + Staff — ✅ Fix 5 responsive ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Selling Items — ✅ Fix 6 overflow-x-auto */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <p className="font-heading text-base font-bold text-zinc-100">Top Selling Items</p>
            <button className="text-[12px] text-orange-400 font-medium bg-transparent border-none cursor-pointer hover:text-orange-300 transition-colors">
              View All
            </button>
          </div>

          {/* ✅ Fix 6 — overflow-x-auto for mobile */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: 420 }}>
              {/* Header */}
              <div
                className="grid gap-3 px-2 pb-2 border-b border-[#2a1f10] mb-2"
                style={{ gridTemplateColumns: '40px 1fr 70px 60px 90px' }}
              >
                {['RANK','ITEM NAME','CATEGORY','ORDERS','REVENUE'].map(h => (
                  <span key={h} className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {TOP_ITEMS.map(item => (
                <div
                  key={item.rank}
                  className="grid gap-3 px-2 py-2.5 rounded-lg hover:bg-[#1f150a] transition-colors duration-150 items-center"
                  style={{ gridTemplateColumns: '40px 1fr 70px 60px 90px' }}
                >
                  <span className="font-heading text-[13px] font-bold text-zinc-500">
                    #{item.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-[13px] font-medium text-zinc-100 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500">{item.category}</span>
                  <span className="text-[13px] text-zinc-300">{item.orders.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-heading text-[12px] font-semibold text-orange-400">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className={`text-[10px] font-bold ${item.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend >= 0 ? '↑' : '↓'}{Math.abs(item.trend)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Staff Performance */}
        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-5">
            Staff Performance
          </p>
          <div className="flex flex-col gap-5">
            {STAFF_PERF.map(member => {
              const pct = Math.round((member.orders / member.max) * 100)
              return (
                <div key={member.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 font-heading"
                        style={{ background: member.avatarBg }}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-100">{member.name}</p>
                        <p className="text-[11px] text-zinc-600">{member.role}</p>
                      </div>
                    </div>
                    <span className="text-[12px] text-zinc-500">{member.orders} orders</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: member.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <button className="w-full mt-6 py-2.5 bg-transparent border border-zinc-700 hover:border-zinc-500 rounded-xl text-[13px] font-medium text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all duration-150">
            View All Staff
          </button>
        </Card>
      </div>
    </div>
  )
}

export default ReportsPage