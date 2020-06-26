const pool = require('../database/db');
const parseUser = require('../helpers/users-helper');

/* GET ALL USERS */
const getUsers = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT 
      us.id,
      us.first_name,
      us.last_name,
      us.email,
      us.identity_card,
      us.phone,
      us.user_type_id,
      ut.user_type,
      us.status,
      us.created_at,
    FROM 
      users 
      AS us
    INNER JOIN 
      user_types
      AS ut
      ON us.user_type_id = ut.id
    WHERE
      us.building_id 
      IN(${building_id})
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
  console.log(id);
  pool.query(
    `
    SELECT 
      us.id,
      us.first_name,
      us.middle_name,
      us.last_name,
      us.maternal_surname,
      us.identity_card,
      us.email,
      us.phone,
      us.image,
      us.status,
      us.user_type_id,
      ut.user_type,
      dp.building_id,
      bu.name
        AS building,
      bu.address,
      ud.department_id,
      dp.number
        AS dep_number,
      dp.status,
      dp.defaulting,
      us.created_at,
      us.updated_at
    FROM 
      users
      AS us
    INNER JOIN 
      users_departments
      AS ud
      ON us.id = ud.user_id
    INNER JOIN 
      departments
      AS dp
      ON ud.department_id = dp.id
    INNER JOIN 
      buildings
      AS bu
      ON dp.building_id = bu.id
    WHERE 
      us.id 
      IN(${id})
    ORDER BY 
      us.id ASC;`,
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
    first_name,
    middle_name,
    last_name,
    maternal_surname,
    identity_card,
    phone,
    email,
    password,
    image,
    user_type,
    buildings,
    departments,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      users 
      (
        first_name,
        middle_name,
        last_name,
        maternal_surname,
        identity_card,
        phone,
        email,
        password,
        image,
        user_type
      ) 
    VALUES 
      (
        '${first_name}', 
        '${middle_name}', 
        '${last_name}', 
        '${maternal_surname}', 
        '${identity_card},
        '${phone}', 
        '${email}', 
        '${password}', 
        '${image}', 
        '${user_type}'
      ) 
    RETURNING id`,
    (error, results) => {
      if (error) {
        throw error;
      }
      /* Create relations */
      const id = results.rows[0].id;
      Promise.all([
        insertRelations(
          id,
          buildings,
          'users_buildings',
          'user_id, building_id'
        ),
        insertRelations(
          id,
          departments,
          'users_departments',
          'user_id, department_id'
        ),
      ])
        .then((results) => {
          response(
            res,
            `User ID: ${id}, 
            with buildings: ${buildings} 
            and departments: ${departments} 
            added successfully!`
          );
        })
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* UPDATE USER */
const updateUser = (req, res) => {
  const {
    id,
    first_name,
    middle_name,
    last_name,
    maternal_surname,
    identity_card,
    phone,
    email,
    password,
    image,
    user_type,
    buildings,
    departments,
  } = req.body;
  pool.query(
    `
    UPDATE 
      users 
    SET 
      first_name = ${first_name}, 
      middle_name = ${middle_name}, 
      last_name = ${last_name}, 
      maternal_surname = ${maternal_surname}, 
      identity_card = ${identity_card}, 
      phone = ${phone}, 
      email = ${email}, 
      password = ${password}, 
      image = ${image}, 
      user_type = ${user_type} 
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      /* Update relations */
      Promise.all([
        deleteRelations(id, 'users_buildings'),
        deleteRelations(id, 'users_departments'),
      ])
        .then(
          Promise.all([
            insertRelations(
              id,
              buildings,
              'users_buildings',
              'user_id, building_id'
            ),
            insertRelations(
              id,
              departments,
              'users_departments',
              'user_id, department_id'
            ),
          ])
            .then((results) => {
              response(
                res,
                `User: ${id}, 
                departments: ${departments} 
                and buildings: ${buildings} 
                modified successfully.`
              );
            })
            .catch((err) => {
              throw err;
            })
        )
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* DELETE USER */
const deleteUsers = (req, res) => {
  const id = req.body;
  Promise.all([
    deleteRelations(id, 'users_buildings'),
    deleteRelations(id, 'users_departments'),
  ])
    .then((results) => {
      pool.query(`DELETE FROM users WHERE id IN(${id})`, (error, results) => {
        if (error) {
          throw error;
        }
        response(res, `User deleted with ID: ${id}. All relations removed.`);
      });
    })
    .catch((err) => {
      throw err;
    });
};

/* INSERT RELATIONS */
const insertRelations = (id, array, table, columns) => {
  let values = [];
  array.forEach((elem_id) => {
    values.push(`(${id}, ${elem_id})`);
  });
  return pool.query(`INSERT INTO ${table} (${columns}) VALUES ${values}`);
};

/* DELETE RELATIONS */
const deleteRelations = (id, table) => {
  return pool.query(`DELETE FROM ${table} WHERE user_id IN(${id})`);
};

/* RESPONSE */
const response = (res, message) => {
  res.status(200).send(message);
};

/* EXPORTS */
module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUsers,
};
