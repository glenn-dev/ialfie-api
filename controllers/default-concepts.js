const pool = require('../database/db');

/* GET ALL DEFAULT CONCEPTS */
const getDefaultConcepts = (req, res) => {
  const { column, id } = req.body;
  pool.query(
    `
    SELECT
      dc.id,
      dc.created_at,
      dc.default_amount,
      dc.default_quantity,
      dc.category_id,
      ca.code
        AS category_code,
      ca.category,
      dc.concept_id, 
      co.code
        AS concept_code,
      co.concept,
      dc.property_id,
      pr.number
        AS property_number,
      dc.building_id,
    FROM 
      default_concepts 
      AS dc
    INNER JOIN 
      categories
      AS ca
      ON dc.category_id = ca.id
    INNER JOIN 
      concepts
      AS co
      ON dc.concept_id = co.id
    INNER JOIN 
      properties
      AS pr
      ON dc.property_id = pr.id
    WHERE 
      dc.${column} = ${id}
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

/* CREATE DEFAULT CONCEPT */
const createDefaultConcept = (req, res) => {
  const {
    default_amount,
    default_quantity,
    category_id,
    concept_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `INSERT INTO 
      default_concepts 
      (
        default_amount, 
        default_quantity, 
        category_id, 
        concept_id, 
        property_id, 
        building_id
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
    [
      default_amount,
      default_quantity,
      category_id,
      concept_id,
      property_id,
      building_id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .send(`Default concept ${results.rows[0].id}, added successfully.`);
    }
  );
};

/* UPDATE DEFAULT CONCEPT */
const updateDefaultConcept = (req, res) => {
  const {
    id,
    default_amount,
    default_quantity,
    category_id,
    concept_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      concepts 
    SET 
      default_amount = $1,
      default_quantity = $2,
      category_id = $3,
      concept_id = $4,
      property_id = $5,
      building_id = $6
    WHERE 
      id = $7`,
    [
      default_amount,
      default_quantity,
      category_id,
      concept_id,
      property_id,
      building_id,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Concept modified with ID: ${id}`);
    }
  );
};

/* DELETE DEFAULT CONCEPTS */
const deleteDefaultConcepts = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM default_concepts WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Default concept deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getDefaultConcepts,
  createDefaultConcept,
  updateDefaultConcept,
  deleteDefaultConcepts,
};
