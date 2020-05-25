const pool = require('../database/db');

/* GET ALL BUILDINGS */
const getBuildings = (req, res) => {
  pool.query('SELECT * FROM buildings ORDER BY b_name ASC', 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* GET BUILDINGS BY ID */
const getBuildingsById = (req, res) => {
  const id = req.body;
  pool.query(`SELECT * FROM buildings WHERE id IN(${id}) ORDER BY b_name ASC`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE BUILDING */
const createBuilding = (req, res) => {
  const { name, address, image, status } = req.body;
  pool.query(
    'INSERT INTO buildings (b_name, address, image, status) VALUES ($1, $2, $3)', 
    [name, address, image], 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(201).send(`Building "${name}" added successfully`);
    }
  );
};

/* UPDATE BUILDING */
const updateBuilding = (req, res) => {
  const {id, name, address, image, status } = req.body;
  pool.query(
    'UPDATE buildings SET b_name = $1, address = $2, image = $3 WHERE id = $4',
    [name, address, image, id, status],
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Building modified with ID: ${id}`);
    }
  );
};

/* DELETE BUILDINGS */
const deleteBuildings = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM buildings WHERE id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Building deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getBuildings,
  getBuildingsById,
  createBuilding,
  updateBuilding,
  deleteBuildings,
};