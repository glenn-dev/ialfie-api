const pool = require('../database/db')

/* GET ALL DEPARTMENTS */
const getDepartments = (req, res) => {
  const building_id = req.body;
  pool.query(`SELECT * FROM departments WHERE building_id = ${building_id} ORDER BY number ASC`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* GET DEPARTMENT BY ID */
const getDepartmentById = (req, res) => {
  const id = req.body
  pool.query(`SELECT * FROM departments WHERE id IN(${id}) ORDER BY name ASC`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE DEPARTMENT */
const createDepartment = (req, res) => {
  const { number, floor, aliquot, building_id, habitability, defaulting } = req.body;
  pool.query(
    'INSERT INTO departments (number, floor, aliquot, building_id, habitability, defaulting) VALUES ($1, $2, $3, $4, $5, $6)', 
    [number, floor, aliquot, building_id, habitability, defaulting], 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(201).send(`Department "${number}" added successfully on building: ${building_id}`);
    }
  );
};

/* UPDATE DEPARTMENT */
const updateDepartment = (req, res) => {
  const { id, number, floor, aliquot, building_id, habitability, defaulting } = req.body;
  pool.query(
    'UPDATE departments SET number = $1, floor = $2, aliquot = $3, building_id = $4, habitability = $5, defaulting = $6 WHERE id = $7',
    [number, floor, aliquot, building_id, habitability, defaulting, id],
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Department modified with ID: ${id}`);
    }
  );
};

/* DELETE DEPARTMENT */
const deleteDepartment = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM departments WHERE id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Department deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};