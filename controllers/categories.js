const pool = require('../database/db');

/* GET ALL CATEGORIES */
const getCategories = (req, res) => {
  const { building_id, category_flag } = req.body;

  pool.query(
    `
    SELECT
      id,
      created_at,
      code,
      category,
      category_flag,
      building_id
    FROM
      categories
    WHERE
      building_id = ${building_id}
      AND category_flag = ${category_flag}
    ORDER BY
      category ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET CATEGORY BY ID */
const getCategoryById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      ca.id,
      ca.code,
      ca.category,
      ca.category_flag,
      ca.building_id,
      ca.created_at,
      co.id
        AS concept_id,
      co.code
        AS concept_code,
      co.concept,
      co.concept_flag
    FROM
      categories
      AS ca
    INNER JOIN
      concepts
      AS co
      ON co.category_id = ca.id
    WHERE
      ca.id = ${id}
    ORDER BY
      ca.category ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE CATEGORY */
const createCategory = (req, res) => {
  const { code, category, category_flag, building_id } = req.body;
  pool.query(
    `
    INSERT INTO 
      categories 
      (code, category, category_flag, building_id) 
    VALUES 
      ($1, $2, $3, $4)`,
    [code, category, category_flag, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Category "${category}" added successfully.`);
    }
  );
};

/* UPDATE CATEGORY */
const updateCategory = (req, res) => {
  const { id, code, category, category_flag, building_id } = req.body;
  pool.query(
    `
    UPDATE 
      categories 
    SET 
      category = $1, code = $2, category_flag = $3, building_id = $4 
    WHERE 
      id = $5`,
    [code, category, category_flag, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Category modified with ID: ${id}`);
    }
  );
};

/* DELETE CATEGORIES */
const deleteCategories = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM categories WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Categories deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategories,
};
