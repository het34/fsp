const { Router } = require('express')

const router = Router()

// Health check — useful to confirm the server is running
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount auth routes at /api/auth
router.use('/auth', require('./auth'))

module.exports = router
