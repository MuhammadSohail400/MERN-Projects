const express = require('express')
const router  = express.Router()
const {
  signup, login, getMe,
  updateProfile, changePassword,
} = require('../controllers/auth.controller')
const { verifyToken } = require('../middleware/auth.middleware')

router.post('/signup',          signup)
router.post('/login',           login)
router.get('/me',               verifyToken, getMe)
router.put('/profile',          verifyToken, updateProfile)
router.put('/change-password',  verifyToken, changePassword)

module.exports = router