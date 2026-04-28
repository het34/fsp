const sql = require('mssql')

// Build connection config from .env
const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  database: process.env.DB_NAME     || 'AuthPractice',
  port:     parseInt(process.env.DB_PORT || '1433'),
  options: {
    trustServerCertificate: true, // required for local dev
    encrypt: false,
    // If DB_INSTANCE is set (e.g. SQLEXPRESS), add it
    ...(process.env.DB_INSTANCE ? { instanceName: process.env.DB_INSTANCE } : {}),
  },
}

// Windows Auth vs SQL Auth
if (process.env.DB_TRUSTED === 'true') {
  config.options.trustedConnection = true
} else {
  config.user     = process.env.DB_USER
  config.password = process.env.DB_PASSWORD
}

// Single pool shared across the whole app
let pool = null

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config)
    console.log('✅ Database connected')
  }
  return pool
}

module.exports = { getPool, sql }
