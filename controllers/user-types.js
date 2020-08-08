const pool = require('../database/db');

/* GET USER-TYPES */
const getUserTypes = (req, res) => {
  pool.query(
    'SELECT * FROM user_types ORDER BY id ASC;',
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
  console.log(user_type);
  pool.query(
    `INSERT INTO user_types (user_type) VALUES ($1)`,
    [user_type],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`User-type "${user_type}" created.`);
    }
  );
};

/* UPDATE USER-TYPE */
const updateUserType = (req, res) => {
  const { id, user_type } = req.body;
  pool.query(
    `UPDATE user_types SET user_type = $1 WHERE id = $2`,
    [user_type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User-type ${id} modified.`);
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
    res.status(200).send(`User-type ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType,
};
