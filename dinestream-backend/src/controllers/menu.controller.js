const { PrismaClient } = require('@prisma/client')
const ApiResponse      = require('../utils/ApiResponse')
const ApiError         = require('../utils/ApiError')
const asyncHandler     = require('../utils/asyncHandler')

const prisma = new PrismaClient()

// GET all menu items
const getMenuItems = asyncHandler(async (req, res) => {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(new ApiResponse(200, items))
})

// GET single item
const getMenuItem = asyncHandler(async (req, res) => {
  const item = await prisma.menuItem.findUnique({
    where:   { id: req.params.id },
    include: { category: true },
  })
  if (!item) throw new ApiError(404, 'Menu item not found')
  res.json(new ApiResponse(200, item))
})

// POST create item
const createMenuItem = asyncHandler(async (req, res) => {
  console.log('📥 Create item request:', req.body)

  const {
    name, description, price,
    emoji, categoryId, prepTime, isAvailable
  } = req.body

  // ── Validation ──────────────────────────────────────────────
  if (!name || !price || !categoryId) {
    throw new ApiError(400,
      `Missing fields: ${!name ? 'name ' : ''}${!price ? 'price ' : ''}${!categoryId ? 'categoryId' : ''}`
    )
  }

  // ── Category exist check ─────────────────────────────────────
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })
  if (!category) {
    throw new ApiError(400, `Category not found: ${categoryId}`)
  }

  // ── Duplicate name check ─────────────────────────────────────
  const existing = await prisma.menuItem.findUnique({
    where: { name: name.trim() }
  })
  if (existing) {
    throw new ApiError(400, `Item "${name}" already exists`)
  }

  // ── Create ───────────────────────────────────────────────────
  const item = await prisma.menuItem.create({
    data: {
      name:        name.trim(),
      description: description || '',
      emoji:       emoji || '🍽️',
      price:       parseFloat(price),
      prepTime:    parseInt(prepTime) || 10,
      isAvailable: isAvailable ?? true,
      categoryId,
    },
    include: { category: true },
  })

  console.log('✅ Item created:', item.name)
  res.status(201).json(new ApiResponse(201, item, 'Item created'))
})

// PUT update item
const updateMenuItem = asyncHandler(async (req, res) => {
  console.log('📥 Update item request:', req.params.id, req.body)

  const {
    name, description, price, emoji,
    categoryId, prepTime, isAvailable
  } = req.body

  // ── Item exist check ─────────────────────────────────────────
  const existing = await prisma.menuItem.findUnique({
    where: { id: req.params.id }
  })
  if (!existing) throw new ApiError(404, 'Menu item not found')

  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data: {
      ...(name        !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description }),
      ...(price       !== undefined && { price: parseFloat(price) }),
      ...(emoji       !== undefined && { emoji }),
      ...(categoryId  !== undefined && { categoryId }),
      ...(prepTime    !== undefined && { prepTime: parseInt(prepTime) }),
      ...(isAvailable !== undefined && { isAvailable }),
    },
    include: { category: true },
  })

  console.log('✅ Item updated:', item.name)
  res.json(new ApiResponse(200, item, 'Item updated'))
})

// DELETE item
const deleteMenuItem = asyncHandler(async (req, res) => {
  const existing = await prisma.menuItem.findUnique({
    where: { id: req.params.id }
  })
  if (!existing) throw new ApiError(404, 'Menu item not found')

  await prisma.menuItem.delete({ where: { id: req.params.id } })
  console.log('✅ Item deleted:', existing.name)
  res.json(new ApiResponse(200, null, 'Item deleted'))
})

// GET all categories
const getCategories = asyncHandler(async (req, res) => {
  const cats = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
  res.json(new ApiResponse(200, cats))
})

module.exports = {
  getMenuItems, getMenuItem,
  createMenuItem, updateMenuItem,
  deleteMenuItem, getCategories,
}