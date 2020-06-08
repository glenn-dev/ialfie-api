const pool = require("../database/db");

/* GET ALL CATEGORIES */
const getCategories = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT
      id,
      name,
      code,
      building_id,
      created_at,
      updated_at
    FROM categories 
    WHERE building_id IN (${building_id}) 
    ORDER BY name ASC;`,
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
      id,
      name,
      code,
      building_id,
      created_at,
      updated_at
    FROM categories 
    WHERE id IN (${id})
      AND 
    ORDER BY name ASC;`,
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
  const { name, code, building_id } = req.body;
  pool.query(
    "INSERT INTO categories (name, code, building_id) VALUES ($1, $2, $3)",
    [name, code, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Category "${name}" added successfully.`);
    }
  );
};

/* UPDATE CATEGORY */
const updateCategory = (req, res) => {
  const { id, name, code, building_id } = req.body;
  pool.query(
    "UPDATE categories SET name = $1, code = $2, building_id = $3 WHERE id = $4",
    [name, code, building_id, id],
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
