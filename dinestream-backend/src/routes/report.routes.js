const express = require('express')
const router  = express.Router()
const {
  getSalesData, getTopItems, getDashboardStats
} = require('../controllers/report.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/dashboard', verifyToken, getDashboardStats)
router.get('/sales',     verifyToken, requireRole('ADMIN','MANAGER'), getSalesData)
router.get('/top-items', verifyToken, requireRole('ADMIN','MANAGER'), getTopItems)

module.exports = router