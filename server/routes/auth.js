const { Router }                  = require('express')
const { register, login, me }     = require('../controllers/authController')
const { verifyToken }             = require('../middleware/auth')

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        verifyToken, me) // verifyToken protects this route

module.exports = router
