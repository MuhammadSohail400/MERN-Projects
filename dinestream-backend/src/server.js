require('dotenv').config()
const app              = require('./app')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const PORT   = process.env.PORT || 5000

const startServer = async () => {
  try {
    await prisma.$connect()
    console.log('✅ PostgreSQL connected')

    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`)
      console.log(`🔍 Health: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Startup failed:', error.message)
    process.exit(1)
  }
}

startServer()