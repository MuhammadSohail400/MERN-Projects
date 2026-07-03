const express = require('express')
const router  = express.Router()
const {
  getTables, updateTableStatus, createTable
} = require('../controllers/table.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/',       verifyToken, getTables)
router.post('/',      verifyToken, requireRole('ADMIN','MANAGER'), createTable)
router.patch('/:id',  verifyToken, updateTableStatus)

module.exports = router