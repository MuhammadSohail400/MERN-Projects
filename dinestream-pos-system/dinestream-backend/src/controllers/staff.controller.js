const bcrypt           = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

const getStaff = asyncHandler(async (req, res) => {
  const staff = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, status: true,
      shift: true, shiftStart: true, shiftEnd: true,
      avatarColor: true, isActive: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  })
  res.json(new ApiResponse(200, staff))
})

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, phone,
          role, shift, shiftStart, shiftEnd,
          status, avatarColor } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, password required')
  }

  const hashed = await bcrypt.hash(password || 'Staff@123', 12)

  const staff = await prisma.user.create({
    data: {
      name, email, phone,
      password:    hashed,
      role:        role?.toUpperCase()   || 'WAITER',
      status:      status?.toUpperCase() || 'ON_DUTY',
      shift, shiftStart, shiftEnd, avatarColor,
    },
    select: {
      id: true, name: true, email: true,
      role: true, status: true, shift: true,
    }
  })

  res.status(201).json(new ApiResponse(201, staff, 'Staff added'))
})

const updateStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, role,
          status, shift, shiftStart,
          shiftEnd, avatarColor, isActive } = req.body

  const staff = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(name        && { name }),
      ...(email       && { email }),
      ...(phone       && { phone }),
      ...(role        && { role:   role.toUpperCase()   }),
      ...(status      && { status: status.toUpperCase() }),
      ...(shift       && { shift }),
      ...(shiftStart  && { shiftStart }),
      ...(shiftEnd    && { shiftEnd }),
      ...(avatarColor && { avatarColor }),
      ...(isActive !== undefined && { isActive }),
    },
    select: {
      id: true, name: true, email: true,
      role: true, status: true,
    }
  })

  res.json(new ApiResponse(200, staff, 'Staff updated'))
})

const deleteStaff = asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } })
  res.json(new ApiResponse(200, null, 'Staff removed'))
})

module.exports = { getStaff, createStaff, updateStaff, deleteStaff }