const pool = require('../database/db');

/* GET ALL USERS */
const getUsers = (req, res) => {
  pool.query(`
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
      ub.building_id,
      bd.b_name,
      bd.address,
      ud.department_id,
      dp.number,
      dp.floor,
      dp.habitability,
      dp.defaulting,
      dp.aliquot
    FROM users
      AS us
      INNER JOIN users_buildings
        AS ub
        ON us.id = ub.user_id
      INNER JOIN buildings
        AS bd
        ON ub.building_id = bd.id
      INNER JOIN users_departments
        AS ud
        ON us.id = ud.user_id
      INNER JOIN departments
        AS dp
        ON ud.department_id = dp.id
    ORDER BY us.first_n ASC;`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows); // Parse method
    }
  );
};

/* GET USER BY ID */
const getUserById = (req, res) => {
  const id = req.body;
  pool.query(`
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
      ub.building_id,
      bd.b_name,
      bd.address,
      ud.department_id,
      dp.number,
      dp.floor,
      dp.habitability,
      dp.defaulting,
      dp.aliquot
    FROM users
      AS us
      INNER JOIN users_buildings
        AS ub
        ON us.id = ub.user_id
      INNER JOIN buildings
        AS bd
        ON ub.building_id = bd.id
      INNER JOIN users_departments
        AS ud
        ON us.id = ud.user_id
      INNER JOIN departments
        AS dp
        ON ud.department_id = dp.id
    WHERE id IN(${id})
    ORDER BY us.first_n ASC;`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows); // Parse method
    }
  );
};

/* CREATE RELATIONS */
const insertRelations = (id, buildings, departments) => {
  /* Insert User-Building relation */
  let values = [];
  buildings.forEach(
    (building, index) => {
      (buildings.length < (index + 1)) ? values.push(`(${id}, ${building}),`) : values.push(`(${id}, ${building})`)
    }
  );
  pool.query(
    `INSERT INTO users_buildings (user_id, building_id) VALUES ${values}`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      console.log(`Relation user: ${id} - buildings: ${buildings} added!`);
    }
  );
  /* Insert User-Department relation */
  values = [];
  departments.forEach(
    (department, index) => {
      (departments.length < (index + 1)) ? values.push(`(${id}, ${department}),`) : values.push(`(${id}, ${department})`)
    }
  );
  pool.query(
    `INSERT INTO users_departments (user_id, department_id) VALUES ${values}`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      console.log(`Relation user ${id} - departments: ${departments} added!`);
    }
  );
};

/* DELETE RELATIONS */
const deleteRelations = (id) => {
  /* Delete User-Building relation */
  pool.query(`DELETE FROM users_buildings WHERE user_id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      console.log(`Relation user: ${id} - buildings: ${buildings} deleted!`);
    }
  );
  /* Delete User-Building relation */
  pool.query(`DELETE FROM users_buildings WHERE user_id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      console.log(`Relation user ${id} - departments: ${departments} deleted!`);
    }
  );
};

/* CREATE USER */
const createUser = (req, res) => {
  const { first_n, last_n, email, password, phone, id_number, user_type, buildings, departments } = req.body
  pool.query(
    'INSERT INTO users (first_n, last_n, email, password, phone, id_number, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
    [first_n, last_n, email, password, phone, id_number, user_type],
    (error, results) => {
      if (error) {
        throw error;
      };
      const id = results.rows[0].id;
      insertRelations(id, buildings, departments);
      res.status(201).send(`User "${first_n} ${last_n}" ID: ${id}, with buildings: ${buildings} and departments: ${departments} added successfully!`);
    }
  );
};

/* UPDATE USER */
const updateUser = (req, res) => {
  const { id, first_n, last_n, email, password, phone, id_number, user_type, buildings, departments } = req.body;
  pool.query(
    'UPDATE users SET first_n = $1, last_n = $2, email = $3, password = $4, phone = $5, id_number = $6, user_type = $7 WHERE id = $8',
    [first_n, last_n, email, password, phone, id_number, user_type, id],
    (error, results) => {
      if (error) {
        throw error;
      };
      deleteRelations(id); // Check questions.
      insertRelations(id, buildings, departments);
      res.status(200).send(`User "${first_n} ${last_n}" with ID: ${id}, departments: ${departments} and buildings: ${buildings} modified  successfully.`);
    }
  );
};

/* DELETE USER */
const deleteUser = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM users WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    };
    deleteRelations(id);
    res.status(200).send(`User deleted with ID: ${id}. All relations removed.`);
  })
}

/* EXPORTS */
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};