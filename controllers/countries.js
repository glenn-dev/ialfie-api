const pool = require('../database/db');

/* GET COUNTRIES */
const getCountries = (req, res) => {
  pool.query('SELECT * FROM countries ORDER BY name ASC;', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

/* CREATE COUNTRY */
const createCountry = (req, res) => {
  const { name } = req.body;
  pool.query(
    `INSERT INTO countries (name) VALUES ${name}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Country "${name}" added successfully.`);
    }
  );
};

/* UPDATE COUNTRY */
const updateCountry = (req, res) => {
  const { id, name } = req.body;
  pool.query(
    `UPDATE countries SET name = ${name} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Country modified with ID: ${id}`);
    }
  );
};

/* DELETE COUNTRY */
const deleteCountry = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM countries WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Country deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
