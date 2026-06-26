const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

// ── GET all orders ──────────────────────────────────────────────
const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query

  const orders = await prisma.order.findMany({
    where:   status ? { status: status.toUpperCase() } : {},
    include: {
      table:  { select: { tableNumber: true, label: true } },
      waiter: { select: { id: true, name: true } },
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

// ── GET single order ─────────────────────────────────────────────
const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where:   { id: req.params.id },
    include: {
      table:  true,
      waiter: { select: { id: true, name: true, role: true } },
      items:  {
        include: { menuItem: true }
      }
    }
  })
  if (!order) throw new ApiError(404, 'Order not found')
  res.json(new ApiResponse(200, order))
})

// ── POST create order — now accepts explicit waiterId ───────────
const createOrder = asyncHandler(async (req, res) => {
  console.log('📥 Create order request:', req.body)

  const { tableId, items, notes, waiterId } = req.body

  // ── Validation ────────────────────────────────────────────────
  if (!tableId) {
    throw new ApiError(400, 'Table is required')
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'At least one item is required')
  }

  // ── Table exist check ────────────────────────────────────────
  const table = await prisma.table.findUnique({ where: { id: tableId } })
  if (!table) {
    throw new ApiError(404, `Table not found: ${tableId}`)
  }

  // ── Resolve final waiter ─────────────────────────────────────
  // Priority: explicit waiterId from request body → fallback to logged-in user
  let finalWaiterId = waiterId || req.user.id

  const waiterExists = await prisma.user.findUnique({
    where: { id: finalWaiterId }
  })
  if (!waiterExists) {
    console.warn(`⚠️ Waiter ${finalWaiterId} not found, falling back to logged-in user`)
    finalWaiterId = req.user.id
  }

  // ── Calculate total + validate each item ─────────────────────
  let totalAmount = 0
  for (const item of items) {
    if (!item.menuItemId || !item.quantity) {
      throw new ApiError(400, 'Each item needs menuItemId and quantity')
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId }
    })
    if (!menuItem) {
      throw new ApiError(404, `Menu item not found: ${item.menuItemId}`)
    }

    const unitPrice = item.unitPrice ?? menuItem.price
    totalAmount += unitPrice * item.quantity
  }

  // ── Generate unique order number ─────────────────────────────
  const count       = await prisma.order.count()
  const orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`

  // ── Create order with items ──────────────────────────────────
  const order = await prisma.order.create({
    data: {
      orderNumber,
      totalAmount,
      notes:    notes || null,
      tableId,
      waiterId: finalWaiterId,
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity:   item.quantity,
          unitPrice:  item.unitPrice ?? 0,
          notes:      item.notes || null,
        }))
      }
    },
    include: {
      table:  true,
      waiter: { select: { id: true, name: true } },
      items:  { include: { menuItem: true } }
    }
  })

  // ── Mark table as occupied + record assigned waiter name ─────
  await prisma.table.update({
    where: { id: tableId },
    data: {
      status: 'OCCUPIED',
      waiter: order.waiter.name,
    }
  })

  console.log('✅ Order created:', order.orderNumber, '| Waiter:', order.waiter.name)
  res.status(201).json(new ApiResponse(201, order, 'Order created'))
})

// ── PATCH update order status ────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  const validStatuses = ['PENDING', 'PREPARING', 'SERVED', 'PAID', 'CANCELLED']
  const normalizedStatus = status?.toUpperCase()

  if (!validStatuses.includes(normalizedStatus)) {
    throw new ApiError(400, `Invalid status. Use: ${validStatuses.join(', ')}`)
  }

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!existing) throw new ApiError(404, 'Order not found')

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data:  { status: normalizedStatus },
    include: {
      table:  true,
      waiter: { select: { id: true, name: true } },
      items:  { include: { menuItem: true } }
    }
  })

  // ── Free up the table when order is closed out ───────────────
  if (['PAID', 'CANCELLED'].includes(normalizedStatus)) {
    await prisma.table.update({
      where: { id: order.tableId },
      data:  { status: 'AVAILABLE', waiter: null, duration: null }
    })
  }

  console.log(`✅ Order ${order.orderNumber} status → ${normalizedStatus}`)
  res.json(new ApiResponse(200, order, 'Order status updated'))
})

// ── DELETE order ─────────────────────────────────────────────────
const deleteOrder = asyncHandler(async (req, res) => {
  const existing = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!existing) throw new ApiError(404, 'Order not found')

  await prisma.order.delete({ where: { id: req.params.id } })
  console.log('✅ Order deleted:', existing.orderNumber)
  res.json(new ApiResponse(200, null, 'Order deleted'))
})

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
}