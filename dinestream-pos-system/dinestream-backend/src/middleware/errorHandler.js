const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message)

  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: `${err.meta?.target} already exists`,
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}

module.exports = errorHandler