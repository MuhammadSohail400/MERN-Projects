const express = require('express')
const router  = express.Router()
const {
  getOrders, getOrder,
  createOrder, updateOrderStatus,
  deleteOrder,
} = require('../controllers/order.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/',           verifyToken, getOrders)
router.get('/:id',        verifyToken, getOrder)
router.post('/',          verifyToken, createOrder)
router.patch('/:id',      verifyToken, updateOrderStatus)
router.delete('/:id',     verifyToken, requireRole('ADMIN'), deleteOrder)

module.exports = router