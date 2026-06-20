import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../utils/formatters'
import reportsService from '../../services/reportsService'

// ── Tab → API range param mapping ───────────────────────────────
const DATE_TABS = [
  { label: 'Today',   value: 'today'   },
  { label: '7 Days',  value: '7days'   },
  { label: '30 Days', value: '30days'  },
]

// ─── Reusable Card ────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#130e06] border border-[#2a1f10] rounded-xl p-4 sm:p-5 transition-colors hover:border-[#3a2a14] ${className}`}>
    {children}
  </div>
)

// ─── KPI Card ─────────────────────────────────────────────────
const KpiCard = ({ label, value, trend, trendLabel, icon, isText }) => (
  <div className="bg-[#130e06] border border-[#2a1f10] rounded-xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 relative overflow-hidden transition-colors hover:border-[#3a2a14]">
    <div className="flex items-start justify-between">
      <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
        {label}
      </p>
      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1f1509] border border-[#2a1f10] rounded-lg flex items-center justify-center text-sm sm:text-base shrink-0">
        {icon}
      </div>
    </div>
    <div className="min-w-0">
      <p className={`font-heading font-bold leading-none truncate ${isText ? 'text-xl sm:text-2xl text-zinc-100' : 'text-2xl sm:text-3xl text-orange-400'}`}>
        {value}
      </p>
      {trend !== undefined && trend !== null && (
        <p className={`text-[11px] sm:text-[12px] font-semibold mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}% vs previous period
        </p>
      )}
      {trendLabel && (
        <p className="text-[11px] sm:text-[12px] text-zinc-500 mt-1.5 truncate">{trendLabel}</p>
      )}
    </div>
  </div>
)

const KpiSkeleton = () => (
  <div className="bg-[#130e06] border border-[#2a1f10] rounded-xl p-5 h-[130px] sm:h-[140px] animate-pulse"/>
)

// ─── Generic Custom Tooltip ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label, valueFormatter, valueSuffix }) => {
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
      {payload.map((p, i) => (
        <p key={i} style={{
          fontSize: 14, fontWeight: 700,
          color: p.color || '#f97316', marginTop: 2,
        }}>
          {valueFormatter ? valueFormatter(p.value) : p.value}
          {valueSuffix || ''}
        </p>
      ))}
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────────────
const EmptyChartState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-14 sm:py-16 gap-2 text-center px-4">
    <span className="text-3xl">📊</span>
    <p className="text-[13px] text-zinc-600">{message}</p>
  </div>
)

// ════════════════════════════════════════════════════════
// REPORTS PAGE
// ════════════════════════════════════════════════════════
const ReportsPage = () => {

  const [activeTab, setActiveTab] = useState('7days')

  const [revenueChart,  setRevenueChart]  = useState([])
  const [revenueTotal,  setRevenueTotal]  = useState(0)
  const [revenueTrend,  setRevenueTrend]  = useState(null)
  const [hourlyData,    setHourlyData]    = useState([])
  const [categoryData,  setCategoryData]  = useState([])
  const [topItems,      setTopItems]      = useState([])
  const [staffPerf,     setStaffPerf]     = useState([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [error,         setError]         = useState(null)

  const loadReports = useCallback(async (range) => {
    setIsLoading(true)
    setError(null)
    try {
      const [
        salesRes,
        hourlyRes,
        categoryRes,
        topItemsRes,
        staffRes,
      ] = await Promise.all([
        reportsService.getSalesData(range),
        reportsService.getHourlyOrders(),
        reportsService.getCategoryBreakdown(range),
        reportsService.getTopItems(range),
        reportsService.getStaffPerformance(range),
      ])

      setRevenueChart(salesRes.data?.chartData || [])
      setRevenueTotal(salesRes.data?.totalRevenue || 0)
      setRevenueTrend(salesRes.data?.revenueTrend ?? null)
      setHourlyData(hourlyRes.data || [])
      setCategoryData(categoryRes.data || [])
      setTopItems(topItemsRes.data || [])
      setStaffPerf(staffRes.data || [])

    } catch (err) {
      console.error('Reports fetch failed:', err)
      setError(err.response?.data?.message || 'Failed to load reports data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReports(activeTab)
  }, [activeTab, loadReports])

  const totalOrders = useMemo(() =>
    topItems.reduce((sum, item) => sum + item.orders, 0)
  , [topItems])

  const avgOrderValue = useMemo(() => {
    if (totalOrders === 0) return 0
    return Math.round(revenueTotal / totalOrders)
  }, [revenueTotal, totalOrders])

  const topCategory = useMemo(() => {
    if (categoryData.length === 0) return { name: 'N/A', value: 0 }
    return [...categoryData].sort((a, b) => b.value - a.value)[0]
  }, [categoryData])

  const maxHourlyOrders = useMemo(() =>
    hourlyData.length > 0 ? Math.max(...hourlyData.map(d => d.orders)) : 0
  , [hourlyData])

  const maxStaffOrders = useMemo(() =>
    staffPerf.length > 0 ? Math.max(...staffPerf.map(s => s.orders)) : 1
  , [staffPerf])

  const exportCSV = useCallback(() => {
    const sections = []

    if (revenueChart.length > 0) {
      sections.push('REVENUE BY PERIOD')
      sections.push('Period,Revenue')
      sections.push(...revenueChart.map(r => `${r.day},${r.revenue}`))
      sections.push('')
    }

    if (topItems.length > 0) {
      sections.push('TOP SELLING ITEMS')
      sections.push('Rank,Item,Category,Orders,Revenue')
      sections.push(...topItems.map((item, i) =>
        `${i + 1},${item.name},${item.category},${item.orders},${item.revenue}`
      ))
      sections.push('')
    }

    if (staffPerf.length > 0) {
      sections.push('STAFF PERFORMANCE')
      sections.push('Name,Role,Orders')
      sections.push(...staffPerf.map(s => `${s.name},${s.role},${s.orders}`))
    }

    if (sections.length === 0) {
      alert('No data available to export for this period.')
      return
    }

    const csv  = sections.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `dinestream-report-${activeTab}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [revenueChart, topItems, staffPerf, activeTab])

  // ════════════════════════════════════════════════════════
  // LOADING STATE
  // ════════════════════════════════════════════════════════
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 font-body max-w-[1400px] w-full">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-[13px] text-zinc-500 mt-1">Loading...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {Array(4).fill(0).map((_, i) => <KpiSkeleton key={i}/>)}
        </div>
        <div className="bg-[#130e06] border border-[#2a1f10] rounded-xl h-[260px] sm:h-[300px] animate-pulse"/>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════
  // ERROR STATE
  // ════════════════════════════════════════════════════════
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-zinc-100 font-semibold">{error}</p>
        <button
          onClick={() => loadReports(activeTab)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-sm font-medium cursor-pointer transition-all shadow-lg shadow-orange-500/20"
        >
          Try Again
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-5 font-body max-w-[1400px] w-full">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-[13px] text-zinc-500 mt-1">
            Track your restaurant performance across all outlets.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {/* Date tabs */}
          <div className="flex items-center gap-1 bg-[#1a1208] border border-[#2a1f10] rounded-xl p-1">
            {DATE_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                disabled={isLoading}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: activeTab === tab.value ? 600 : 400,
                  background: activeTab === tab.value ? '#f97316' : 'transparent',
                  color: activeTab === tab.value ? 'white' : '#71717a',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px',
              background: 'transparent',
              border: '1px solid #3f3f46',
              borderRadius: 10,
              fontSize: 13, fontWeight: 500,
              color: '#a1a1aa', cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
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
            <span className="hidden xs:inline sm:inline">Export CSV</span>
            <span className="inline xs:hidden sm:hidden">Export</span>
          </button>

          {/* Refresh */}
          <button
            onClick={() => loadReports(activeTab)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px',
              background: '#f97316',
              border: 'none',
              borderRadius: 10,
              fontSize: 13, fontWeight: 600,
              color: 'white', cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 0 16px #f9731625',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
            onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          label="Revenue"
          value={formatCurrency(revenueTotal)}
          trend={revenueTrend}
          icon="📈"
        />
        <KpiCard
          label="Orders"
          value={totalOrders.toLocaleString()}
          icon="🧾"
        />
        <KpiCard
          label="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          icon="💳"
        />
        <KpiCard
          label="Top Category"
          value={topCategory.name}
          trendLabel={`${topCategory.value}% of total sales`}
          icon="🍔"
          isText
        />
      </div>

      {/* ── Revenue Trend ── */}
      <Card>
        <div className="flex items-start justify-between mb-4 sm:mb-5 flex-wrap gap-3">
          <div>
            <p className="font-heading text-base font-bold text-zinc-100">
              Revenue Trend
            </p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              {DATE_TABS.find(t => t.value === activeTab)?.label} performance
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-heading text-lg font-bold text-orange-400">
              {formatCurrency(revenueTotal)} Total
            </p>
          </div>
        </div>

        {revenueChart.length === 0 ? (
          <EmptyChartState message="No revenue data for this period yet" />
        ) : (
          <ResponsiveContainer width="100%" height={240} className="sm:!h-[260px]">
            <AreaChart data={revenueChart} margin={{ top: 10, right: 4, left: -16, bottom: 0 }}>
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
                tickFormatter={v => v === 0 ? '0' : `${v/1000}k`}
                width={44}
              />
              <Tooltip
                content={<CustomTooltip valueFormatter={formatCurrency} />}
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
        )}
      </Card>

      {/* ── Peak Hours + Category ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-1">Peak Hours</p>
          <p className="text-[12px] text-zinc-500 mb-4 sm:mb-5">Order volume today</p>

          {hourlyData.length === 0 ? (
            <EmptyChartState message="No orders placed today yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[220px]">
              <BarChart data={hourlyData} barSize={16}>
                <CartesianGrid strokeDasharray="4 4" stroke="#2a1f10" vertical={false}/>
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#52525b', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#52525b', fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip valueSuffix=" orders" />}/>
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.orders === maxHourlyOrders ? '#f97316' : '#3b82f6'}
                      fillOpacity={entry.orders === maxHourlyOrders ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-1">Category Breakdown</p>
          <p className="text-[12px] text-zinc-500 mb-4">Revenue share by category</p>

          {categoryData.length === 0 ? (
            <EmptyChartState message="No sales data for this period" />
          ) : (
            <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <ResponsiveContainer width={150} height={150} className="sm:!w-[160px] sm:!h-[160px]">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%" cy="50%"
                      innerRadius={48} outerRadius={70}
                      paddingAngle={2} dataKey="value"
                      startAngle={90} endAngle={-270}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color}/>
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[11px] text-zinc-500">Top</p>
                  <p className="font-heading text-xl font-bold text-zinc-100">
                    {topCategory.value}%
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 w-full min-w-0">
                {categoryData.map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }}/>
                      <span className="text-[13px] text-zinc-400 truncate">{item.name}</span>
                    </div>
                    <span className="font-heading text-[13px] font-bold text-zinc-100 shrink-0">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Top Items + Staff Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <p className="font-heading text-base font-bold text-zinc-100">Top Selling Items</p>
          </div>

          {topItems.length === 0 ? (
            <EmptyChartState message="No items sold in this period" />
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
              <div style={{ minWidth: 420 }}>
                <div
                  className="grid gap-3 px-2 pb-2 border-b border-[#2a1f10] mb-2"
                  style={{ gridTemplateColumns: '36px 1fr 70px 60px 90px' }}
                >
                  {['RANK','ITEM NAME','CATEGORY','ORDERS','REVENUE'].map(h => (
                    <span key={h} className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </span>
                  ))}
                </div>

                {topItems.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="grid gap-3 px-2 py-2.5 rounded-lg hover:bg-[#1f150a] transition-colors duration-150 items-center"
                    style={{ gridTemplateColumns: '36px 1fr 70px 60px 90px' }}
                  >
                    <span className="font-heading text-[13px] font-bold text-zinc-500">
                      #{i + 1}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{item.emoji}</span>
                      <span className="text-[13px] font-medium text-zinc-100 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 truncate">{item.category}</span>
                    <span className="text-[13px] text-zinc-300">{item.orders.toLocaleString()}</span>
                    <span className="font-heading text-[12px] font-semibold text-orange-400 whitespace-nowrap">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <p className="font-heading text-base font-bold text-zinc-100 mb-4 sm:mb-5">
            Staff Performance
          </p>

          {staffPerf.length === 0 ? (
            <EmptyChartState message="No staff orders in this period" />
          ) : (
            <div className="flex flex-col gap-5">
              {staffPerf.map(member => {
                const pct = Math.round((member.orders / maxStaffOrders) * 100)
                return (
                  <div key={member.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 font-heading"
                          style={{ background: member.avatarColor }}
                        >
                          {member.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-100 truncate">{member.name}</p>
                          <p className="text-[11px] text-zinc-600 capitalize">{member.role?.toLowerCase()}</p>
                        </div>
                      </div>
                      <span className="text-[12px] text-zinc-500 shrink-0 whitespace-nowrap">{member.orders} orders</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: member.avatarColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ReportsPage