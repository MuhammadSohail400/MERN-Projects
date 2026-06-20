const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

// GET all orders
const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query

  const orders = await prisma.order.findMany({
    where:   status ? { status: status.toUpperCase() } : {},
    include: {
      table:  { select: { tableNumber: true, label: true } },
      waiter: { select: { name: true } },
      items:  {
        include: {
          menuItem: { select: { name: true, emoji: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(new ApiResponse(200, orders))
})

// GET single order
const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where:   { id: req.params.id },
    include: {
      table:  true,
      waiter: { select: { name: true, role: true } },
      items:  {
        include: {
          menuItem: true
        }
      }
    }
  })
  if (!order) throw new ApiError(404, 'Order not found')
  res.json(new ApiResponse(200, order))
})

// POST create order
const createOrder = asyncHandler(async (req, res) => {
  const { tableId, items, notes } = req.body

  if (!tableId || !items?.length) {
    throw new ApiError(400, 'Table and items required')
  }

  // Calculate total
  let totalAmount = 0
  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId }
    })
    if (!menuItem) throw new ApiError(404, `Item ${item.menuItemId} not found`)
    totalAmount += menuItem.price * item.quantity
  }

  // Generate order number
  const count       = await prisma.order.count()
  const orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`

  const order = await prisma.order.create({
    data: {
      orderNumber,
      totalAmount,
      notes:    notes || null,
      tableId,
      waiterId: req.user.id,
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity:   item.quantity,
          unitPrice:  item.unitPrice,
          notes:      item.notes || null,
        }))
      }
    },
    include: {
      table:  true,
      waiter: { select: { name: true } },
      items:  { include: { menuItem: true } }
    }
  })

  // Table ko occupied mark karo
  await prisma.table.update({
    where: { id: tableId },
    data:  { status: 'OCCUPIED', waiter: req.user.name }
  })

  res.status(201).json(new ApiResponse(201, order, 'Order created'))
})

// PATCH update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  const validStatuses = ['PENDING','PREPARING','SERVED','PAID','CANCELLED']
  if (!validStatuses.includes(status?.toUpperCase())) {
    throw new ApiError(400, 'Invalid status')
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data:  { status: status.toUpperCase() },
    include: {
      table:  true,
      waiter: { select: { name: true } },
      items:  { include: { menuItem: true } }
    }
  })

  // Agar paid ya cancelled → table free karo
  if (['PAID', 'CANCELLED'].includes(status.toUpperCase())) {
    await prisma.table.update({
      where: { id: order.tableId },
      data:  { status: 'AVAILABLE', waiter: null, duration: null }
    })
  }

  res.json(new ApiResponse(200, order, 'Order status updated'))
})

// DELETE order
const deleteOrder = asyncHandler(async (req, res) => {
  await prisma.order.delete({ where: { id: req.params.id } })
  res.json(new ApiResponse(200, null, 'Order deleted'))
})

module.exports = {
  getOrders, getOrder,
  createOrder, updateOrderStatus,
  deleteOrder,
}