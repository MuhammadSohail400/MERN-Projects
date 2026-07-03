const express = require('express')
const router  = express.Router()
const {
  getSalesData, getTopItems,
  getDashboardStats, getHourlyOrders,
  getCategoryBreakdown, getStaffPerformance,
} = require('../controllers/report.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/dashboard',  verifyToken, getDashboardStats)
router.get('/sales',      verifyToken, requireRole('ADMIN','MANAGER'), getSalesData)
router.get('/top-items',  verifyToken, requireRole('ADMIN','MANAGER'), getTopItems)
router.get('/hourly',     verifyToken, requireRole('ADMIN','MANAGER'), getHourlyOrders)
router.get('/categories', verifyToken, requireRole('ADMIN','MANAGER'), getCategoryBreakdown)
router.get('/staff-perf', verifyToken, requireRole('ADMIN','MANAGER'), getStaffPerformance)

module.exports = router