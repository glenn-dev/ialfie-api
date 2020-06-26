const pool = require('../database/db');

/* GET MUNICIPALITIES */
const getMunicipalities = (req, res) => {
  pool.query(
    'SELECT * FROM municipalities ORDER BY name ASC;',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE MUNICIPALITY */
const createMunicipality = (req, res) => {
  const { name } = req.body;
  pool.query(
    `INSERT INTO municipalities (name) VALUES ${name}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Municipality "${name}" added successfully.`);
    }
  );
};

/* UPDATE MUNICIPALITY */
const updateMunicipality = (req, res) => {
  const { id, name } = req.body;
  pool.query(
    `UPDATE municipalities SET name = ${name} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Municipality modified with ID: ${id}`);
    }
  );
};

/* DELETE MUNICIPALITY */
const deleteMunicipality = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM municipalities WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Municipality deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getMunicipalities,
  createMunicipality,
  updateMunicipality,
  deleteMunicipality,
};
