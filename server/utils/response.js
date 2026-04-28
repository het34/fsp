// Helpers to send consistent JSON responses from every route.
// Every route uses these instead of writing res.json() directly.

// Success response — wraps data in { success, message, data }
function sendSuccess(res, data = {}, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({ success: true, message, data })
}

// Error response — returns { success: false, message }
function sendError(res, message = 'Something went wrong', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message })
}

module.exports = { sendSuccess, sendError }
