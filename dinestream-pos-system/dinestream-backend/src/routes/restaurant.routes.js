const express = require('express')
const router  = express.Router()
const { getRestaurant, updateRestaurant } = require('../controllers/restaurant.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.get('/',  verifyToken, getRestaurant)
router.put('/',  verifyToken, requireRole('ADMIN'), updateRestaurant)

module.exports = router