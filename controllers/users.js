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
    FROM users
      AS us
      INNER JOIN users_departments
        AS ud
        ON us.id = ud.user_id
      INNER JOIN departments
        AS dp
        ON ud.department_id = dp.id
      INNER JOIN buildings
        AS bu
        ON dp.building_id = bu.id
    ORDER BY us.id ASC;`,
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
    FROM users
      AS us
      INNER JOIN users_departments
        AS ud
        ON us.id = ud.user_id
      INNER JOIN departments
        AS dp
        ON ud.department_id = dp.id
      INNER JOIN buildings
        AS bu
        ON dp.building_id = bu.id
    WHERE us.id IN(${id})
    ORDER BY us.id ASC;`,
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
    'INSERT INTO users (first_n, last_n, email, password, phone, id_number, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [first_n, last_n, email, password, phone, id_number, user_type],
    (error, results) => {
      if (error) {
        throw error;
      }
      /* Create relations */
      const id = results.rows[0].id;
      Promise.all([
        insertUsersBuildings(id, buildings),
        insertUsersDepartments(id, departments),
      ])
        .then((res) => {
          response(
            res,
            `User ID: ${id}, with buildings: ${buildings} and departments: ${departments} added successfully!`
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
    'UPDATE users SET first_n = $1, last_n = $2, email = $3, password = $4, phone = $5, id_number = $6, user_type = $7 WHERE id = $8',
    [first_n, last_n, email, password, phone, id_number, user_type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      /* Update relations */
      Promise.all([deleteUsersBuildings(id), deleteUsersDepartments(id)])
        .then(
          Promise.all([
            insertUsersBuildings(id, buildings),
            insertUsersDepartments(id, departments),
          ])
            .then((results) => {
              response(
                res,
                `User ID: ${id}, departments: ${departments} and buildings: ${buildings} modified successfully.`
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
  Promise.all([deleteUsersBuildings(id), deleteUsersDepartments(id)])
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
const assignValues = (id, array) => {
  let values = [];
  array.forEach((elem_id) => {
    values.push(`(${id}, ${elem_id})`);
  });
  return values;
};
const insertUsersBuildings = (id, buildings) => {
  return pool.query(
    `INSERT INTO users_buildings (user_id, building_id) VALUES ${assignValues(
      id,
      buildings
    )}`
  );
};
const insertUsersDepartments = (id, departments) => {
  return pool.query(
    `INSERT INTO users_departments (user_id, department_id) VALUES ${assignValues(
      id,
      departments
    )}`
  );
};

/* DELETE RELATIONS */
const deleteUsersBuildings = (id) => {
  return pool.query(`DELETE FROM users_buildings WHERE user_id IN(${id})`);
};
const deleteUsersDepartments = (id) => {
  return pool.query(`DELETE FROM users_departments WHERE user_id IN(${id})`);
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
