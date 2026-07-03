const jwt              = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'No token provided')
  }

  const token   = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const user = await prisma.user.findUnique({
    where:  { id: decoded.id },
    select: {
      id:       true,
      name:     true,
      email:    true,
      role:     true,
      isActive: true,
    }
  })

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid or expired token')
  }

  req.user = user
  next()
})

module.exports = { verifyToken }