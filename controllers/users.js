const pool = require('../database/db');
const { parseAllUsers, parseUserInfo } = require('../helpers/users-helper');

/* GET ALL USERS */
const getUsers = (req, res) => {
  const { building_id, index, params } = req.body;
  const queryArray = [
    `AND li.created_at >= '${params}'`,
    `AND li.property_id = ${params}`,
    `AND li.user_type_id = ${params}`,
    `AND li.status = ${params}`,
    `AND us.status = ${params}`,
  ];

  pool.query(
    `
    SELECT 
      us.id,
      us.created_at,
      us.updated_at,
      us.image,
      us.first_name,
      us.last_name,
      us.identity_number,
      us.phone,
      us.email,
      us.status
    FROM 
      users
      AS us
    INNER JOIN
      liabilities
      AS li
      ON li.user_id = us.id
    WHERE
      li.building_id = ${building_id}
      ${queryArray[index]}
    ORDER BY 
      us.first_name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(parseAllUsers(results.rows));
    }
  );
};

/* GET USER BY ID */
const getUserById = (req, res) => {
  const { id, building_id } = req.body;
  pool.query(
    `
    SELECT
      us.id,
      us.created_at,
      us.updated_at,
      us.image,
      us.first_name,
      us.middle_name,
      us.last_name,
      us.maternal_surname,
      us.identity_number,
      us.phone,
      us.email,
      us.status,
      li.user_type_id,
      ut.user_type,
      li.property_id,
      pr.property_type_id,
      pt.property_type,
      pr.number
        AS property_number,
      pr.floor,
      pr.defaulting,
      pr.status
        AS property_status,
      pr.main_property_flag
    FROM 
      users
      AS us
    INNER JOIN 
      liabilities
      AS li
      ON us.id = li.user_id
    INNER JOIN
      user_types
      AS ut
      ON li.user_type_id = ut.id
    INNER JOIN 
      properties
      AS pr
      ON li.property_id = pr.id
    INNER JOIN
      property_types
      AS pt
      ON pr.property_type_id = pt.id
    WHERE 
      us.id = ${id}
      AND li.building_id = ${building_id}
    ORDER BY 
      pr.main_property_flag DESC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(parseUserInfo(results.rows)); // parseUserInfo(results.rows)
    }
  );
};

/* CREATE USER */
const createUser = (req, res) => {
  const {
    image,
    first_name,
    middle_name,
    last_name,
    maternal_surname,
    identity_number,
    phone,
    email,
    password,
    status,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      users 
      (
        image,
        first_name,
        middle_name,
        last_name,
        maternal_surname,
        identity_number,
        phone,
        email,
        password,
        status
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING id`,
    [
      image,
      first_name,
      middle_name,
      last_name,
      maternal_surname,
      identity_number,
      phone,
      email,
      password,
      status,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User ${results.rows[0].id} created.`);
    }
  );
};

/* UPDATE USER */
const updateUser = (req, res) => {
  const {
    id,
    image,
    first_name,
    middle_name,
    last_name,
    maternal_surname,
    identity_number,
    phone,
    email,
    password,
    status,
  } = req.body;
  pool.query(
    `
    UPDATE 
      users 
    SET 
      image = $1, 
      first_name = $2, 
      middle_name = $3, 
      last_name = $4, 
      maternal_surname = $5, 
      identity_number = $6, 
      phone = $7, 
      email = $8, 
      password = $9, 
      status = $10
    WHERE 
      id = $11`,
      [ 
        image,
        first_name,
        middle_name,
        last_name,
        maternal_surname,
        identity_number,
        phone,
        email,
        password,
        status, 
        id
      ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User ${id} updated.`);
    }
  );
};

/* DELETE USER */
const deleteUsers = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM users WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Users ${id} deleted!`);
  });
};

/* EXPORTS */
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUsers,
};
