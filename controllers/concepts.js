const pool = require('../database/db')

/* GET ALL CONCEPTS */
const getConcepts = (req, res) => {
  const building_id = req.body;
  pool.query(`
    SELECT
      id,
      code,
      concept,
      building_id,
      created_at,
      updated_at
    FROM concepts 
    WHERE building_id = ${building_id} 
    ORDER BY concept ASC;`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* GET CONCEPTS BY ID */
const getConceptsById = (req, res) => {
  const id = req.body
  pool.query(`
    SELECT
      id,
      code,
      concept,
      building_id,
      created_at,
      updated_at
    FROM concepts 
    WHERE id IN (${id})
      AND 
    ORDER BY concept ASC;`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE CONCEPT */
const createConcept = (req, res) => {
  const { code, concept, building_id } = req.body;
  pool.query(
    'INSERT INTO concepts (code, concept, building_id) VALUES ($1, $2, $3)', 
    [code, concept, building_id], 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(201).send(`Concept "${concept}" added successfully.`);
    }
  );
};

/* UPDATE CONCEPT */
const updateConcept = (req, res) => {
  const { id, code, concept, building_id } = req.body;
  pool.query(
    'UPDATE concepts SET code = $1, concept = $2, building_id = $3 WHERE id = $4',
    [code, concept, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Concept modified with ID: ${id}`);
    }
  );
};

/* DELETE CONCEPTS */
const deleteConcepts = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM concepts WHERE id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Concepts deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getConcepts,
  getConceptsById,
  createConcept,
  updateConcept,
  deleteConcepts,
};