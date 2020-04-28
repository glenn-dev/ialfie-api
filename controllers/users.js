const pool = require('../db')

// GET ALL USERS:
const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY name ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// GET USER BY ID:
const getUserById = (req, res) => {
  const { id } = req.body

  pool.query(
    `SELECT * FROM users WHERE id IN(${id}) ORDER BY name ASC`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// CREATE (POST) USER:
const createUser = (req, res) => {
  const { name, last_name, email, password, phone } = req.body

  pool.query(
    'INSERT INTO users (name, last_name, email, password, phone) VALUES ($1, $2, $3, $4, $5)', 
    [name, last_name, email, password, phone],
    (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User "${name} ${last_name}" added successfully`)
  })
}

// UPDATE (PUT) USER:
const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, last_name, email, password, phone } = req.body

  pool.query(
    'UPDATE users SET name = $1, last_name = $2, email = $3, password = $4, phone = $5 WHERE id = $6',
    [name, last_name, email, password, phone, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

// DELETE USER:
const deleteUser = (req, res) => {
  const { id } = req.body

  pool.query(`DELETE FROM users WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

// EXPORTS:
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}