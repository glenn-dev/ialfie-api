const pool = require('../database/db');

/* GET REGIONS */
const getRegions = (req, res) => {
  pool.query('SELECT * FROM regions ORDER BY name ASC;', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

/* CREATE REGION */
const createRegion = (req, res) => {
  const { name } = req.body;
  pool.query(
    `INSERT INTO regions (name) VALUES ${name}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Region "${name}" added successfully.`);
    }
  );
};

/* UPDATE REGION */
const updateRegion = (req, res) => {
  const { id, name } = req.body;
  pool.query(
    `UPDATE regions SET name = ${name} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Region modified with ID: ${id}`);
    }
  );
};

/* DELETE REGION */
const deleteRegion = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM regions WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Region deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
};
