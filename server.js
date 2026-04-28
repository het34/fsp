// server.js — Custom server: Express API + Next.js frontend on one port.
// NOTE: This file is NOT processed by the Next.js compiler.
//       Use plain Node.js/CommonJS syntax only.

require('dotenv').config() // Load .env variables first

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const express = require('express')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

// Initialise Next.js
const app = next({ dev, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const expressApp = express()

  // ── Body parsers ──────────────────────────────────────────────────────────
  expressApp.use(express.json())
  expressApp.use(express.urlencoded({ extended: true }))

  // ── Express API routes (/api/*) ───────────────────────────────────────────
  // All routes defined here take priority over Next.js Route Handlers at the
  // same paths (avoid creating app/api/** route handlers for the same paths).
  expressApp.use('/api', require('./server/routes'))

  // Global Error Handler for Express Routes
  const { errorHandler } = require('./server/middleware/errorHandler')
  expressApp.use('/api', errorHandler)

  // ── Next.js handler (pages, static files, RSC, etc.) ─────────────────────
  // Express 5 requires '/{*path}' instead of bare '*'
  expressApp.all('/{*path}', (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // ── HTTP server ───────────────────────────────────────────────────────────
  const httpServer = createServer(expressApp)

  httpServer.listen(port, () => {
    console.log('')
    console.log(`  ✅  Server ready`)
    console.log(`  🌐  Next.js  →  http://localhost:${port}`)
    console.log(`  🚀  Express  →  http://localhost:${port}/api`)
    console.log(`  📦  Mode: ${dev ? 'development' : 'production'}`)
    console.log('')
  })
})
