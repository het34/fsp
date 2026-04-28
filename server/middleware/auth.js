const jwt = require('jsonwebtoken')
const { sendError } = require('../utils/response')

// Middleware — reads "Authorization: Bearer <token>" and verifies it.
// If valid, attaches the decoded payload as req.user and calls next().
// If missing or invalid, responds with 401 immediately.
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id, email, iat, exp }
    next()
  } catch {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

module.exports = { verifyToken }
