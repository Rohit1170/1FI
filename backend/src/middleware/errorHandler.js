class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500
  const message = statusCode === 500 ? 'Internal server error' : err.message

  if (statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({ error: message })
}

module.exports = { AppError, errorHandler }
