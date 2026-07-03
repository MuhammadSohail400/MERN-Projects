import { useMemo, useEffect, useState } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import StatCard from '../../components/shared/StatCard'
import { formatCurrency } from '../../utils/formatters'
import reportsService from '../../services/reportsService'
import useOrders from '../../hooks/useOrders'

// ─── Static chart data (baad mein API se aayega) ─────────────
const MOCK_REVENUE_DATA = [
  { day: 'Mon', revenue: 198000 },
  { day: 'Tue', revenue: 245000 },
  { day: 'Wed', revenue: 189000 },
  { day: 'Thu', revenue: 312000 },
  { day: 'Fri', revenue: 398000 },
  { day: 'Sat', revenue: 445000 },
  { day: 'Sun', revenue: 284500 },
]

const MOCK_HOURLY_DATA = [
  { hour: '10am', orders: 4  },
  { hour: '11am', orders: 8  },
  { hour: '12pm', orders: 18 },
  { hour: '1pm',  orders: 24 },
  { hour: '2pm',  orders: 16 },
  { hour: '3pm',  orders: 9  },
  { hour: '6pm',  orders: 19 },
  { hour: '7pm',  orders: 28 },
  { hour: '8pm',  orders: 32 },
  { hour: '9pm',  orders: 21 },
]

const MOCK_CATEGORY_DATA = [
  { name: 'Burgers',  value: 35, color: '#f97316' },
  { name: 'Drinks',   value: 22, color: '#3b82f6' },
  { name: 'Pizza',    value: 18, color: '#22c55e' },
  { name: 'Deals',    value: 15, color: '#eab308' },
  { name: 'Desserts', value: 10, color: '#a855f7' },
]

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    pending:   { color: '#eab308', bg: '#eab30818', label: 'Pending'   },
    preparing: { color: '#3b82f6', bg: '#3b82f618', label: 'Preparing' },
    served:    { color: '#a855f7', bg: '#a855f718', label: 'Served'    },
    paid:      { color: '#22c55e', bg: '#22c55e18', label: 'Paid'      },
    cancelled: { color: '#ef4444', bg: '#ef444418', label: 'Cancelled' },
  }
  const c = config[status] || config.pending
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 10, fontWeight: 600,
      padding: '3px 8px', borderRadius: 20,
      border: `1px solid ${c.color}25`,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1c1c20',
      border: '1px solid #ffffff15',
      borderRadius: 8, padding: '10px 14px',
    }}>
      <p style={{ fontSize: 12, color: '#71717a', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{
          fontSize: 13, fontWeight: 600,
          color: p.color || '#f97316',
        }}>
          {p.name === 'revenue'
            ? formatCurrency(p.value)
            : `${p.value} orders`
          }
        </p>
      ))}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <h3 style={{
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: 14, fontWeight: 700,
      color: '#f4f4f5', letterSpacing: '-0.01em',
    }}>
      {title}
    </h3>
    {sub && (
      <p style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>{sub}</p>
    )}
  </div>
)

// ─── Card ─────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#111113',
    border: '1px solid #ffffff0a',
    borderRadius: 14, padding: 20,
    minWidth: 0, overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
)

// ─── Skeleton ─────────────────────────────────────────────────
const StatSkeleton = () => (
  <div style={{
    background: '#111113',
    border: '1px solid #ffffff0a',
    borderRadius: 14, padding: 20,
    height: 120,
    animation: 'shimmer 1.5s infinite',
  }}/>
)

// ════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ════════════════════════════════════════════════════════
const DashboardPage = () => {

  // ── Real API state ───────────────────────────────────────────
  const [dashStats,  setDashStats]  = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Recent orders from OrdersContext
  const { orders, isLoading: ordersLoading } = useOrders()

  // ── Fetch dashboard stats from backend ───────────────────────
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true)
        const res = await reportsService.getDashboardStats()
        setDashStats(res.data)
      } catch (err) {
        console.error('Dashboard stats failed:', err)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  // ── Recent 5 orders ──────────────────────────────────────────
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [orders])

  // ── Stat cards — real data ───────────────────────────────────
  const statCards = useMemo(() => [
    {
      title:      "Today's Revenue",
      value:      formatCurrency(dashStats?.todayRevenue || 0),
      sub:        'vs yesterday',
      icon:       '₨',
      color:      '#f97316',
      trendValue: 12.5,
    },
    {
      title:      'Total Orders',
      value:      dashStats?.totalOrders || 0,
      sub:        `${dashStats?.activeOrders || 0} active now`,
      icon:       '🧾',
      color:      '#3b82f6',
      trendValue: 8.3,
    },
    {
      title:      'Active Tables',
      value:      `${dashStats?.activeTables || 0}/${dashStats?.totalTables || 0}`,
      sub:        'tables occupied',
      icon:       '🪑',
      color:      '#22c55e',
      trendValue: -4.2,
    },
    {
      title:      'Avg Order Value',
      value:      formatCurrency(
        dashStats?.totalOrders > 0
          ? dashStats.todayRevenue / dashStats.totalOrders
          : 0
      ),
      sub:        'per order today',
      icon:       '📈',
      color:      '#a855f7',
      trendValue: 5.2,
    },
  ], [dashStats])

  // ── Time greeting ────────────────────────────────────────────
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 24,
      fontFamily: 'DM Sans, sans-serif',
      maxWidth: 1400, width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* ── Greeting ── */}
      <div className="dash-greeting" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 22, fontWeight: 700,
            color: '#f4f4f5', letterSpacing: '-0.02em',
          }}>
            {greeting} 👋
          </h2>
          <p style={{ fontSize: 13, color: '#52525b', marginTop: 3 }}>
            Here's what's happening at your restaurant today.
          </p>
        </div>

        {/* Live indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#22c55e12',
          border: '1px solid #22c55e25',
          borderRadius: 20, padding: '6px 14px',
          flexShrink: 0,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
            animation: 'pulse 2s infinite',
          }}/>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
            Live
          </span>
        </div>
      </div>

      {/* ── Stat Cards — real data ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14,
      }}>
        {statsLoading
          ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i}/>)
          : statCards.map((card, i) => (
              <StatCard key={i} {...card}/>
            ))
        }
      </div>

      {/* ── Charts Row ── */}
      <div className="dash-charts-row" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
      }}>
        {/* Area Chart */}
        <Card>
          <SectionHeader title="Revenue This Week" sub="Daily revenue in PKR"/>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
              <XAxis
                dataKey="day"
                tick={{ fill: '#52525b', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}k`}
                width={36}
              />
              <Tooltip content={<CustomTooltip/>}/>
              <Area
                type="monotone" dataKey="revenue"
                stroke="#f97316" strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card>
          <SectionHeader title="Orders by Hour" sub="Today's order volume"/>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_HOURLY_DATA} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
              <XAxis
                dataKey="hour"
                tick={{ fill: '#52525b', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#52525b', fontSize: 10 }}
                axisLine={false} tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="orders" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="dash-bottom-row" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 14,
      }}>

        {/* Recent Orders — REAL DATA ── */}
        <Card>
          <SectionHeader title="Recent Orders" sub="Last 5 orders"/>

          {ordersLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{
                  height: 48, background: '#18181b',
                  borderRadius: 8,
                  animation: 'shimmer 1.5s infinite',
                }}/>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 0',
            }}>
              <span style={{ fontSize: 32 }}>📋</span>
              <p style={{ fontSize: 13, color: '#52525b', marginTop: 8 }}>
                No orders yet today
              </p>
            </div>
          ) : (
            <div className="dash-table-scroll">
              <div style={{ minWidth: 480 }}>

                {/* Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 70px 90px 80px',
                  padding: '8px 10px',
                  borderBottom: '1px solid #ffffff08',
                }}>
                  {['Order','Table','Items','Amount','Status'].map(h => (
                    <span key={h} style={{
                      fontSize: 10, fontWeight: 600,
                      color: '#3f3f46',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows — real orders */}
                {recentOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 80px 70px 90px 80px',
                      padding: '12px 10px',
                      borderRadius: 8,
                      transition: 'background 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffffff05'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Order number */}
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: '#f4f4f5',
                      }}>
                        {order.orderNumber}
                      </div>
                      <div style={{ fontSize: 11, color: '#52525b', marginTop: 1 }}>
                        {order.waiter}
                      </div>
                    </div>

                    {/* Table */}
                    <span style={{
                      fontSize: 13, color: '#a1a1aa', alignSelf: 'center',
                    }}>
                      T-{String(order.tableNumber).padStart(2,'0')}
                    </span>

                    {/* Items count */}
                    <span style={{
                      fontSize: 13, color: '#a1a1aa', alignSelf: 'center',
                    }}>
                      {order.items?.length || 0} items
                    </span>

                    {/* Amount */}
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: '#f4f4f5', alignSelf: 'center',
                    }}>
                      {formatCurrency(order.totalAmount)}
                    </span>

                    {/* Status */}
                    <div style={{ alignSelf: 'center' }}>
                      <StatusBadge status={order.status}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Pie Chart */}
        <Card>
          <SectionHeader title="Sales by Category" sub="Today's breakdown"/>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={MOCK_CATEGORY_DATA}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value"
              >
                {MOCK_CATEGORY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color}/>
                ))}
              </Pie>
              <Tooltip
                formatter={v => [`${v}%`, '']}
                contentStyle={{
                  background: '#1c1c20',
                  border: '1px solid #ffffff15',
                  borderRadius: 8, fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8,
          }}>
            {MOCK_CATEGORY_DATA.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: item.color, flexShrink: 0,
                  }}/>
                  <span style={{ fontSize: 12, color: '#71717a' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa' }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Animations + Responsive */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
        .dash-table-scroll { overflow-x: auto; }
        @media (max-width: 1024px) {
          .dash-charts-row  { grid-template-columns: 1fr !important; }
          .dash-bottom-row  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dash-greeting h2 { font-size: 18px !important; }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage