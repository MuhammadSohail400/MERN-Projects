const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

// ── Get restaurant info (singleton — sirf ek record hoga) ──────
const getRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await prisma.restaurant.findFirst()

  // Agar abhi tak koi record nahi hai, default banao
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name:    'DineStream Restaurant',
        address: 'Karachi, Pakistan',
        phone:   '+92 300 0000000',
      }
    })
  }

  res.json(new ApiResponse(200, restaurant))
})

// ── Update restaurant info ──────────────────────────────────────
const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, address, phone } = req.body

  let restaurant = await prisma.restaurant.findFirst()

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { name, address, phone }
    })
  } else {
    restaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data:  { name, address, phone }
    })
  }

  res.json(new ApiResponse(200, restaurant, 'Restaurant info updated'))
})

module.exports = { getRestaurant, updateRestaurant }