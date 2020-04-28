const pool = require('../db')

// GET ALL BUILDINGS:
const getBuildings = (req, res) => {
  pool.query('SELECT * FROM buildings ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// GET BUILDINGS BY ID:
const getBuildingById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query(
    'SELECT * FROM buildings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// CREATE (POST) BUILDING:
const createBuilding = (req, res) => {
  const { name, address, image } = req.body

  pool.query(
    'INSERT INTO buildings (name, address, image) VALUES ($1, $2, $3)', 
    [name, address, image], 
    (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Building ${name} added successfully`)
  })
}

// UPDATE (PUT) BUILDING:
const updateBuilding = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, address, image } = req.body

  pool.query(
    'UPDATE buildings SET name = $1, address = $2, image = $3 WHERE id = $4',
    [name, address, image, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

// DELETE BUILDING:
const deleteBuilding = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM buildings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Building deleted with ID: ${id}`)
  })
}

// EXPORTS:
module.exports = {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
}