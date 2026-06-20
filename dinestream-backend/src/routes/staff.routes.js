const express = require('express')
const router  = express.Router()
const {
  getStaff, createStaff,
  updateStaff, deleteStaff,
} = require('../controllers/staff.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/',       verifyToken, requireRole('ADMIN','MANAGER'), getStaff)
router.post('/',      verifyToken, requireRole('ADMIN','MANAGER'), createStaff)
router.put('/:id',    verifyToken, requireRole('ADMIN','MANAGER'), updateStaff)
router.delete('/:id', verifyToken, requireRole('ADMIN'),           deleteStaff)

module.exports = router