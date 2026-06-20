const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

const getTables = asyncHandler(async (req, res) => {
  const tables = await prisma.table.findMany({
    orderBy: { tableNumber: 'asc' }
  })
  res.json(new ApiResponse(200, tables))
})

const updateTableStatus = asyncHandler(async (req, res) => {
  const { status, waiter, duration } = req.body

  const table = await prisma.table.update({
    where: { id: req.params.id },
    data: {
      status:   status?.toUpperCase(),
      waiter:   waiter  || null,
      duration: duration || null,
    }
  })

  res.json(new ApiResponse(200, table, 'Table updated'))
})

const createTable = asyncHandler(async (req, res) => {
  const { tableNumber, capacity, floor, zone } = req.body

  const table = await prisma.table.create({
    data: {
      tableNumber: parseInt(tableNumber),
      label:       `T-${String(tableNumber).padStart(2, '0')}`,
      capacity:    parseInt(capacity),
      floor:       parseInt(floor) || 1,
      zone:        zone || null,
    }
  })

  res.status(201).json(new ApiResponse(201, table, 'Table created'))
})

module.exports = { getTables, updateTableStatus, createTable }