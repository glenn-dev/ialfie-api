const pool = require('../database/db')

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

// CREATE USER:
const createUser = (req, res) => {
  const { name, last_name, email, password, phone, id_number, building_id, department_id } = req.body

  pool.query(
    'INSERT INTO users (name, last_name, email, password, phone, id_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
    [name, last_name, email, password, phone, id_number],
    (error, results) => {
    if (error) {
      throw error
    }
    let user_id = results.rows[0].id
    
    // CREATE RELATION USER-BUILDINGS:
    for(let i = 0; i < building_id.length; i++) {
      pool.query(
        `INSERT INTO users_buildings (user_id, building_id) VALUES (${user_id}, ${building_id[i]})`, 
        (error, results) => {
        if (error) {
          throw error
        }
        console.log(`Relation user: ${user_id} - building: ${building_id[i]} created!`);
      })
    }

    // CREATE RELATION USER-DEPARTMENTS (TEST PENDING)
    for(let i = 0; i < department_id.length; i++) {
      pool.query(
        `INSERT INTO users_departments (user_id, department_id) VALUES (${user_id}, ${department_id[i]})`, 
        (error, results) => {
        if (error) {
          throw error
        }
        console.log(`Relation user: ${user_id} - department: ${department_id[i]} created!`);
      })
    }

    res.status(201).send(`User "${name} ${last_name}" with ID: ${results.insertId}, building ID: ${building_id} and department ID: ${department_id} added successfully`)
  })
}

// UPDATE USER:
const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, last_name, email, password, phone, id_number } = req.body

  pool.query(
    'UPDATE users SET name = $1, last_name = $2, email = $3, password = $4, phone = $5, id_number = $6 WHERE id = $7',
    [name, last_name, email, password, phone, id_number, id],
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