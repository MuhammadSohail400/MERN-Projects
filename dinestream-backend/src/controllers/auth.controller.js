const bcrypt           = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')
const generateToken    = require('../utils/generateToken')

const prisma = new PrismaClient()

// ── Signup ────────────────────────────────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password required')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new ApiError(409, 'Email already registered')

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name, email,
      password: hashed,
      role:     role?.toUpperCase() || 'WAITER',
    },
    select: {
      id: true, name: true,
      email: true, role: true,
    }
  })

  const token = generateToken(user.id)

  res.status(201).json(
    new ApiResponse(201, { user, token }, 'Account created')
  )
})

// ── Login ─────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password required')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new ApiError(401, 'Invalid email or password')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new ApiError(401, 'Invalid email or password')

  if (!user.isActive) throw new ApiError(403, 'Account deactivated')

  const { password: _, ...safeUser } = user
  const token = generateToken(user.id)

  res.json(
    new ApiResponse(200, { user: safeUser, token }, 'Login successful')
  )
})

// ── Get Me ────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user))
})

// ── Update Profile ───────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body
  const userId = req.user.id

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required')
  }

  // Email already kisi aur ka toh nahi
  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } }
  })
  if (existing) {
    throw new ApiError(409, 'This email is already in use')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data:  { name, email },
    select: {
      id: true, name: true, email: true, role: true,
    }
  })

  res.json(new ApiResponse(200, user, 'Profile updated successfully'))
})

// ── Change Password ──────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user.id

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required')
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: userId },
    data:  { password: hashedPassword },
  })

  res.json(new ApiResponse(200, null, 'Password changed successfully'))
})
module.exports = { signup, login, getMe, updateProfile, changePassword}