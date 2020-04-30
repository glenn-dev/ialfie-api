const pool = require('../database/db')

// GET ALL ADMINS:
const getAdmins = (req, res) => {
  pool.query('SELECT * FROM admins ORDER BY name ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// GET ADMIN BY ID:
const getAdminById = (req, res) => {
  const { id } = req.body

  pool.query(
    `SELECT * FROM admins WHERE id IN(${id}) ORDER BY name ASC`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// CREATE ADMIN:
const createAdmin = (req, res) => {
  const { name, last_name, email, password, phone, id_number, building_id } = req.body

  pool.query(
    'INSERT INTO admins (name, last_name, email, password, phone, id_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
    [name, last_name, email, password, phone, id_number],
    (error, results) => {
      if (error) {
        throw error
      }
      let admin_id = results.rows[0].id
      
      // CREATE RELATION ADMIN-BUILDING
      pool.query(
        'INSERT INTO admins_buildings (admin_id, building_id) VALUES ($1, $2)', 
        [admin_id, building_id],
        (error, results) => {
        if (error) {
          throw error
        }
      })
      res.status(201).send(`Admin "${name} ${last_name}" with ID: ${results.insertId} and relation with building ID: ${building_id} added successfully`)
    }
  )
}

// UPDATE ADMIN:
const updateAdmin = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, last_name, email, password, phone, id_number } = req.body

  pool.query(
    'UPDATE admins SET name = $1, last_name = $2, email = $3, password = $4, phone = $5, id_number = $6 WHERE id = $7',
    [name, last_name, email, password, phone, id_number, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

// DELETE ADMIN:
const deleteAdmin = (req, res) => {
  const { id } = req.body

  pool.query(`DELETE FROM admins WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Admins deleted with ID: ${id}`)
  })
}

// EXPORTS:
module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
}