const pool = require('../database/db');

/* GET ALL CATEGORIES */
const getCategories = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT
      id,
      code,
      category,
      category_flag,
      building_id,
      updated_at,
      created_at
    FROM 
      categories 
    WHERE 
      building_id = ${building_id} 
    ORDER BY 
      name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET CATEGORIES BY ID */
const getCategoriesById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      ca.id,
      ca.code,
      ca.category,
      ca.category_flag,
      ca.building_id,
      ca.updated_at,
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
      category ASC;`,
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
  const { category, code, building_id } = req.body;
  pool.query(
    `
    INSERT INTO 
      categories 
      (category, code, category_flag, building_id) 
    VALUES 
      ($1, $2, $3, $4)`,
    [category, code, category_flag, building_id],
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
  const { id, category, code, category_flag, building_id } = req.body;
  pool.query(
    `
    UPDATE 
      categories 
    SET 
      category = $1, code = $2, category_flag = $3, building_id = $4 
    WHERE 
      id = $5`,
    [category, code, category_flag, building_id, id],
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
  getCategoriesById,
  createCategory,
  updateCategory,
  deleteCategories,
};
