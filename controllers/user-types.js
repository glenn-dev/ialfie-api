const pool = require('../database/db');

/* GET USER-TYPES */
const getUserTypes = (req, res) => {
  pool.query(
    'SELECT * FROM user_types ORDER BY user_type ASC;',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE USER-TYPE */
const createUserType = (req, res) => {
  const { user_type } = req.body;
  pool.query(
    `INSERT INTO user_types (user_type) VALUES ${user_type}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`User-type "${user_type}" added successfully.`);
    }
  );
};

/* UPDATE USER-TYPE */
const updateUserType = (req, res) => {
  const { id, user_type } = req.body;
  pool.query(
    `UPDATE user_types SET user_type = ${user_type} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User-type modified with ID: ${id}`);
    }
  );
};

/* DELETE USER-TYPE */
const deleteUserType = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM user_types WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`User-type deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType,
};
