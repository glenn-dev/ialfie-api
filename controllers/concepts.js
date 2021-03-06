const pool = require('../database/db');

/* GET ALL CONCEPTS */
const getConcepts = (req, res) => {
  const {column, id} = req.body;
  pool.query(
    `
    SELECT
      co.id,
      co.created_at,
      co.code,
      co.concept, 
      co.concept_flag,
      co.category_id,
      ca.code
        AS cat_code,
      ca.category,
      co.building_id,
    FROM 
      concepts 
      AS co
    INNER JOIN 
      categories
      AS ca
      ON co.category_id = ca.id
    WHERE 
      co.${column} 
      IN(${id}) 
    ORDER BY 
      co.concept ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET CONCEPT BY ID */
const getConceptById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      co.id,
      co.code,
      co.concept,
      co.concept_flag, 
      co.category_id,
      ca.code
        AS cat_code,
      ca.category,
      co.building_id,
      co.created_at,
      co.updated_at
    FROM 
      concepts 
      AS co
    INNER JOIN 
      categories
      AS ca
      ON co.category_id = ca.id
    WHERE 
      co.id = ${id}
    ORDER BY 
      concept ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE CONCEPT */
const createConcept = (req, res) => {
  const { code, concept, concept_flag, category_id, building_id } = req.body;
  pool.query(
    `INSERT INTO 
      concepts 
      (code, concept, concept_flag, category_id, building_id) 
    VALUES 
      ($1, $2, $3, $4, $5)`,
    [code, concept, concept_flag, category_id, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Concept "${concept}" added successfully.`);
    }
  );
};

/* UPDATE CONCEPT */
const updateConcept = (req, res) => {
  const {
    id,
    code,
    concept,
    concept_flag,
    category_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      concepts 
    SET 
      code = $1, 
      concept = $2, 
      concept_flag = $3
      category_id = $4, 
      building_id = $5 
    WHERE 
      id = $6`,
    [code, concept, concept_flag, category_id, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Concept ${id} modified.`);
    }
  );
};

/* DELETE CONCEPTS */
const deleteConcepts = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM concepts WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Concepts ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getConcepts,
  getConceptById,
  createConcept,
  updateConcept,
  deleteConcepts,
};
