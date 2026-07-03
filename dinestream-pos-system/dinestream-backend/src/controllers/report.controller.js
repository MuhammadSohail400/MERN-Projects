const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

// ── Helper: range se days nikalo ───────────────────────────────
const getRangeDays = (range) => {
  switch (range) {
    case 'today':   return 1
    case '30days':  return 30
    case '7days':
    default:        return 7
  }
}

// ── Dashboard Stats ──────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalOrders, activeOrders,
    totalTables, activeTables,
    todayRevenue,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: { in: ['PENDING','PREPARING'] } } }),
    prisma.table.count(),
    prisma.table.count({ where: { status: 'OCCUPIED' } }),
    prisma.order.aggregate({
      where: { status: 'PAID', createdAt: { gte: today } },
      _sum:  { totalAmount: true }
    }),
  ])

  res.json(new ApiResponse(200, {
    totalOrders, activeOrders,
    totalTables, activeTables,
    todayRevenue: todayRevenue._sum.totalAmount || 0,
  }))
})

// ── Sales Data — range-aware + trend ───────────────────────────
const getSalesData = asyncHandler(async (req, res) => {
  const { range = '7days' } = req.query

  // ── Validate range param ──────────────────────────────────────
  const validRanges = ['today', '7days', '30days']
  if (!validRanges.includes(range)) {
    throw new ApiError(400, `Invalid range. Use: ${validRanges.join(', ')}`)
  }

  const days = getRangeDays(range)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  // Previous period (for trend comparison)
  const prevStartDate = new Date()
  prevStartDate.setDate(prevStartDate.getDate() - (days * 2))
  prevStartDate.setHours(0, 0, 0, 0)

  const [currentOrders, previousOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: 'PAID', createdAt: { gte: startDate } },
      select: { totalAmount: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: prevStartDate, lt: startDate },
      },
      select: { totalAmount: true },
    }),
  ])

  // ── Group current period by day ──────────────────────────────
  let revenueData = []

  if (range === 'today') {
    // Group by hour for today
    const hourlyMap = {}
    currentOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours()
      const label = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour-12}pm`
      hourlyMap[label] = (hourlyMap[label] || 0) + order.totalAmount
    })
    revenueData = Object.entries(hourlyMap).map(([day, revenue]) => ({ day, revenue }))
  } else {
    const dayLabels = days === 7
      ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      : null

    if (dayLabels) {
      const grouped = {}
      dayLabels.forEach(d => grouped[d] = 0)
      currentOrders.forEach(order => {
        const dayIdx = new Date(order.createdAt).getDay()
        const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayIdx]
        grouped[dayName] += order.totalAmount
      })
      revenueData = dayLabels.map(day => ({ day, revenue: grouped[day] || 0 }))
    } else {
      // 30 days — group by date
      const grouped = {}
      currentOrders.forEach(order => {
        const dateKey = new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        grouped[dateKey] = (grouped[dateKey] || 0) + order.totalAmount
      })
      revenueData = Object.entries(grouped).map(([day, revenue]) => ({ day, revenue }))
    }
  }

  // ── Calculate trend % ────────────────────────────────────────
  const currentTotal  = currentOrders.reduce((s, o) => s + o.totalAmount, 0)
  const previousTotal = previousOrders.reduce((s, o) => s + o.totalAmount, 0)

  const revenueTrend = previousTotal > 0
    ? Math.round(((currentTotal - previousTotal) / previousTotal) * 1000) / 10
    : currentTotal > 0 ? 100 : 0

  res.json(new ApiResponse(200, {
    chartData: revenueData,
    totalRevenue: currentTotal,
    revenueTrend,
  }))
})

// ── Top Selling Items — range-aware ─────────────────────────────
const getTopItems = asyncHandler(async (req, res) => {
  const { range = '7days' } = req.query
  const days = getRangeDays(range)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const topItems = await prisma.orderItem.groupBy({
    by:      ['menuItemId'],
    where:   { order: { createdAt: { gte: startDate } } },
    _sum:    { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take:    5,
  })

  const itemsWithDetails = await Promise.all(
    topItems.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where:   { id: item.menuItemId },
        include: { category: true }
      })

      const orderItems = await prisma.orderItem.findMany({
        where: {
          menuItemId: item.menuItemId,
          order: { createdAt: { gte: startDate } }
        }
      })

      const revenue = orderItems.reduce(
        (sum, oi) => sum + (oi.unitPrice * oi.quantity), 0
      )

      return {
        name:     menuItem?.name || 'Unknown',
        emoji:    menuItem?.emoji || '🍽️',
        category: menuItem?.category?.name || 'Other',
        orders:   item._sum.quantity || 0,
        revenue,
      }
    })
  )

  res.json(new ApiResponse(200, itemsWithDetails))
})

// ── Orders by Hour ───────────────────────────────────────────────
const getHourlyOrders = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: today } },
    select: { createdAt: true }
  })

  const hourlyMap = {}
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours()
    hourlyMap[hour] = (hourlyMap[hour] || 0) + 1
  })

  const hourlyData = Object.keys(hourlyMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(hour => {
      const h = parseInt(hour)
      const label = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`
      return { hour: label, orders: hourlyMap[hour] }
    })

  res.json(new ApiResponse(200, hourlyData))
})

// ── Category Breakdown — range-aware, explicitly sorted ────────
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { range = '7days' } = req.query
  const days = getRangeDays(range)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const orderItems = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: startDate } } },
    include: { menuItem: { include: { category: true } } }
  })

  const categoryTotals = {}
  let grandTotal = 0

  orderItems.forEach(oi => {
    const catName = oi.menuItem?.category?.name || 'Other'
    const amount  = oi.unitPrice * oi.quantity
    categoryTotals[catName] = (categoryTotals[catName] || 0) + amount
    grandTotal += amount
  })

  const colors = {
    Burgers: '#f97316', Pizza: '#ef4444',
    Drinks:  '#3b82f6', Mains: '#22c55e',
    Sides:   '#eab308', Desserts: '#a855f7',
  }

  const categoryData = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      value: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
      color: colors[name] || '#71717a',
    }))
    // ✅ EXPLICIT sort — never assume order from object iteration
    .sort((a, b) => b.value - a.value)

  res.json(new ApiResponse(200, categoryData))
})

// ── Staff Performance ───────────────────────────────────────────
const getStaffPerformance = asyncHandler(async (req, res) => {
  const { range = '7days' } = req.query
  const days = getRangeDays(range)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const staffOrders = await prisma.order.groupBy({
    by:      ['waiterId'],
    where:   { createdAt: { gte: startDate } },
    _count:  { id: true },
    orderBy: { _count: { id: 'desc' } },
    take:    5,
  })

  const performance = await Promise.all(
    staffOrders.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: { id: item.waiterId }
      })
      return {
        name:        user?.name || 'Unknown',
        role:        user?.role || 'WAITER',
        orders:      item._count.id,
        avatarColor: user?.avatarColor || '#f97316',
      }
    })
  )

  res.json(new ApiResponse(200, performance))
})

module.exports = {
  getDashboardStats,
  getSalesData,
  getTopItems,
  getHourlyOrders,
  getCategoryBreakdown,
  getStaffPerformance,
}