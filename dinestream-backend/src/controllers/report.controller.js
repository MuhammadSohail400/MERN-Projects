const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

const getSalesData = asyncHandler(async (req, res) => {
  // Last 7 days revenue
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const orders = await prisma.order.findMany({
    where: {
      status:    'PAID',
      createdAt: { gte: sevenDaysAgo }
    },
    select: {
      totalAmount: true,
      createdAt:   true,
    }
  })

  // Group by day
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const grouped = {}

  orders.forEach(order => {
    const day = days[new Date(order.createdAt).getDay()]
    grouped[day] = (grouped[day] || 0) + order.totalAmount
  })

  const revenueData = days.map(day => ({
    day,
    revenue: grouped[day] || 0,
  }))

  res.json(new ApiResponse(200, revenueData))
})

const getTopItems = asyncHandler(async (req, res) => {
  const topItems = await prisma.orderItem.groupBy({
    by:      ['menuItemId'],
    _sum:    { quantity: true, unitPrice: true },
    _count:  { menuItemId: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take:    5,
  })

  const itemsWithDetails = await Promise.all(
    topItems.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where:   { id: item.menuItemId },
        include: { category: true }
      })
      return {
        menuItem,
        orders:  item._count.menuItemId,
        revenue: item._sum.unitPrice * item._sum.quantity,
      }
    })
  )

  res.json(new ApiResponse(200, itemsWithDetails))
})

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalOrders,
    activeOrders,
    totalTables,
    activeTables,
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
    totalOrders,
    activeOrders,
    totalTables,
    activeTables,
    todayRevenue: todayRevenue._sum.totalAmount || 0,
  }))
})

module.exports = { getSalesData, getTopItems, getDashboardStats }