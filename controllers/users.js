const pool = require('../database/db');
const parseUser = require('../helpers/users-helper');

/* GET ALL USERS */
const getUsers = (req, res) => {
  const { column, id } = req.body;
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
    WHERE
      us.${column} 
      IN(${id})
    ORDER BY 
      us.first_name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET USER BY ID */
const getUsersById = (req, res) => {
  const id = req.body;
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
      li.building_id,
      bu.name
        AS building,
      bu.street,
      bu.block_number,
      li.property_id,
      pr.number
        AS property_number,
      pr.floor,
      pr.defaulting,
      pr.status
        AS property_status,
      pt.property_type
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
    INNER JOIN 
      buildings
      AS bu
      ON li.building_id = bu.id
    WHERE 
      us.id = ${id}
    ORDER BY 
      us.first_name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(parseUser(results.rows));
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
      (
        '${image}', 
        '${first_name}', 
        '${middle_name}', 
        '${last_name}', 
        '${maternal_surname}', 
        '${identity_number}, 
        '${phone}', 
        '${email}', 
        '${password}', 
        '${status}'
      ) 
    RETURNING id`,
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
      image = ${image}, 
      first_name = ${first_name}, 
      middle_name = ${middle_name}, 
      last_name = ${last_name}, 
      maternal_surname = ${maternal_surname}, 
      identity_number = ${identity_number}, 
      phone = ${phone}, 
      email = ${email}, 
      password = ${password}, 
      status = ${status}
    WHERE 
      id = ${id}`,
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
  pool.query(
    `UPDATE users SET status = false WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Users ${id} deleted!`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUsers,
};
