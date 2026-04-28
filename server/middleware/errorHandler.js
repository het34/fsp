const { sendError } = require('../utils/response')

// Global error handler — must be the LAST middleware added to Express.
// Any route that calls next(err) lands here.
function errorHandler(err, req, res, next) {
  console.error('[Server Error]', err.message)
  const statusCode = err.statusCode || 500
  return sendError(res, err.message || 'Internal server error', statusCode)
}

module.exports = { errorHandler }
