const pool = require('../database/db');

/* GET COUNTRIES */
const getCountries = (req, res) => {
  pool.query(
    'SELECT * FROM countries ORDER BY country ASC;',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE COUNTRY */
const createCountry = (req, res) => {
  const country = req.body;
  pool.query(
    `INSERT INTO countries (country) VALUES ${country}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Country "${country}" added successfully.`);
    }
  );
};

/* UPDATE COUNTRY */
const updateCountry = (req, res) => {
  const { id, country } = req.body;
  pool.query(
    `UPDATE countries SET country = ${country} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Country ${id} modified.`);
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
    res.status(200).send(`Country ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
