const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const { findUserByEmail, createUser } = require('../models/userModel')
const { sendSuccess, sendError }      = require('../utils/response')

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400)
    }

    // Check if email is already taken
    const existing = await findUserByEmail(email)
    if (existing) {
      return sendError(res, 'Email is already in use', 409)
    }

    // Hash password — never store plain text
    const hashed = await bcrypt.hash(password, 10)
    const user   = await createUser(name, email, hashed)

    return sendSuccess(res, { user }, 201, 'Account created successfully')
  } catch (err) {
    next(err) // passes to errorHandler middleware
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400)
    }

    const user = await findUserByEmail(email)

    // Use the same generic message to avoid revealing if email exists
    if (!user) {
      return sendError(res, 'Invalid credentials', 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Sign a JWT with user id and email
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return sendSuccess(
      res,
      { token, user: { id: user.id, name: user.name, email: user.email } },
      200,
      'Login successful'
    )
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me  — protected (verifyToken runs first)
async function me(req, res, next) {
  try {
    // req.user is set by verifyToken middleware
    const user = await findUserByEmail(req.user.email)
    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    return sendSuccess(res, {
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me }
