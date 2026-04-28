const { getPool, sql } = require('../config/db')

// Find one user by email — returns the row or null
async function findUserByEmail(email) {
  const pool = await getPool()
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM Users WHERE email = @email')
  return result.recordset[0] || null
}

// Insert a new user and return the created row
async function createUser(name, email, hashedPassword) {
  const pool = await getPool()
  const result = await pool.request()
    .input('name',     sql.NVarChar, name)
    .input('email',    sql.NVarChar, email)
    .input('password', sql.NVarChar, hashedPassword)
    .query(`
      INSERT INTO Users (name, email, password)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
      VALUES (@name, @email, @password)
    `)
  return result.recordset[0]
}

module.exports = { findUserByEmail, createUser }
