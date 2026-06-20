const express = require('express')
const router  = express.Router()
const {
  getMenuItems, getMenuItem,
  createMenuItem, updateMenuItem,
  deleteMenuItem, getCategories,
} = require('../controllers/menu.controller')
const { verifyToken }  = require('../middleware/auth.middleware')
const { requireRole }  = require('../middleware/role.middleware')

router.get('/',           getMenuItems)
router.get('/categories', getCategories)
router.get('/:id',        getMenuItem)
router.post('/',          verifyToken, requireRole('ADMIN','MANAGER'), createMenuItem)
router.put('/:id',        verifyToken, requireRole('ADMIN','MANAGER'), updateMenuItem)
router.delete('/:id',     verifyToken, requireRole('ADMIN'),           deleteMenuItem)

module.exports = router