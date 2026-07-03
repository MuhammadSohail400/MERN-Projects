require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const morgan       = require('morgan')
const errorHandler = require('./middleware/errorHandler')

const authRoutes   = require('./routes/auth.routes')
const menuRoutes   = require('./routes/menu.routes')
const orderRoutes  = require('./routes/order.routes')
const tableRoutes  = require('./routes/table.routes')
const staffRoutes  = require('./routes/staff.routes')
const reportRoutes = require('./routes/report.routes')
const restaurantRoutes = require('./routes/restaurant.routes')

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api/menu',    menuRoutes)
app.use('/api/orders',  orderRoutes)
app.use('/api/tables',  tableRoutes)
app.use('/api/staff',   staffRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/restaurant', restaurantRoutes)

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: '🍽️ DineStream API running',
    time:    new Date().toISOString(),
  })
})

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// ── Error Handler ─────────────────────────────────────────────
app.use(errorHandler)

module.exports = app