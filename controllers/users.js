const pool = require('../database/db');
const parseUser = require('../helpers/users-helper');

/* GET ALL USERS */
const getUsers = (req, res) => {
  pool.query(
    `
    SELECT 
      us.id,
      us.first_n,
      us.last_n,
      us.email,
      us.password,
      us.id_number,
      us.phone,
      us.status,
      us.created_at,
      us.updated_at,
      dp.building_id,
      bu.name
        AS building,
      bu.address,
      ud.department_id,
      dp.number,
      dp.floor,
      dp.status,
      dp.defaulting,
      dp.aliquot
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

/* GET USER BY ID */
const getUsersById = (req, res) => {
  const id = req.body;
  console.log(id);
  pool.query(
    `
    SELECT 
      us.id,
      us.first_n,
      us.last_n,
      us.email,
      us.password,
      us.id_number,
      us.phone,
      us.status,
      us.created_at,
      us.updated_at,
      dp.building_id,
      bu.name
        AS building,
      bu.address,
      ud.department_id,
      dp.number,
      dp.floor,
      dp.status,
      dp.defaulting,
      dp.aliquot
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
    first_n,
    last_n,
    email,
    password,
    phone,
    id_number,
    user_type,
    buildings,
    departments,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      users 
      (
        first_n, 
        last_n, 
        email, 
        password, 
        phone, 
        id_number, 
        user_type
      ) 
    VALUES 
      (
        '${first_n}', 
        '${last_n}', 
        '${email}', 
        '${password}', 
        '${phone}', 
        '${id_number}', 
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
    first_n,
    last_n,
    email,
    password,
    phone,
    id_number,
    user_type,
    buildings,
    departments,
  } = req.body;
  pool.query(
    `
    UPDATE 
      users 
    SET 
      first_n = ${first_n}, 
      last_n = ${last_n}, 
      email = ${email}, 
      password = ${password}, 
      phone = ${phone}, 
      id_number = ${id_number}, 
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
