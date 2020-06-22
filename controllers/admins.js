const pool = require('../database/db');
const parseAdmins = require('../helpers/admins-helper');

/* GET ALL ADMINS */
const getAdmins = (req, res) => {
  pool.query('SELECT * FROM admins ORDER BY first_n ASC;', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

/* GET ADMINS BY ID */
const getAdminsById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT 
	    ad.id,
	    ad.first_n,
	    ad.last_n,
      ad.email,
      ad.password,
	    ad.id_number,
	    ad.phone,
	    ad.status,
	    ad.created_at,
	    ad.updated_at,
	    ab.building_id,
      bu.name
        AS building,
	    bu.address
    FROM 
      admins
      AS ad
    INNER JOIN 
      admins_buildings
      AS ab
      ON ad.id = ab.admin_id
    INNER JOIN 
      buildings
      AS bu
      ON ab.building_id = bu.id
    WHERE 
      ad.id IN(${id})
    ORDER BY 
      ad.first_n ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(parseAdmins(results.rows));
    }
  );
};

/* CREATE ADMIN */
const createAdmin = (req, res) => {
  const {
    first_n,
    last_n,
    email,
    password,
    phone,
    id_number,
    buildings,
    status,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      admins 
      (first_n, last_n, email, password, phone, id_number, status) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING id`,
    [first_n, last_n, email, password, phone, id_number, status],
    (error, results) => {
      if (error) {
        throw error;
      }
      insertAdminBuilding(results.rows[0].id, res, buildings);
    }
  );
};

/* UPDATE ADMIN */
const updateAdmin = (req, res) => {
  const {
    id,
    first_n,
    last_n,
    email,
    password,
    phone,
    id_number,
    status,
    buildings,
  } = req.body;
  pool.query(
    `
    UPDATE 
      admins 
    SET 
      first_n = $1, 
      last_n = $2, 
      email = $3, 
      password = $4, 
      phone = $5, 
      id_number = $6, 
      status = $7 
    WHERE 
      id = $8`,
    [first_n, last_n, email, password, phone, id_number, status, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      /* Update relation admin-building */
      deleteAdminBuilding(id)
        .then(insertAdminBuilding(id, res, buildings))
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* CREATE RELATION ADMIN-BUILDING */
const insertAdminBuilding = (id, res, buildings) => {
  let values = [];
  buildings.forEach((building) => {
    values.push(`(${id}, ${building})`);
  });
  pool.query(
    `INSERT INTO admins_buildings (admin_id, building_id) VALUES ${values}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .send(
          `Admin: ${id} with buildings: ${buildings} added/modified successfully.`
        );
    }
  );
};

/* DELETE ADMINS */
const deleteAdmins = (req, res) => {
  const id = req.body;
  deleteAdminBuilding(id)
    .then(
      pool.query(`DELETE FROM admins WHERE id IN(${id})`, (error, results) => {
        if (error) {
          throw error;
        }
        res
          .status(200)
          .send(`Admins deleted with ID: ${id}. All relations removed.`);
      })
    )
    .catch((err) => {
      throw err;
    });
};

/* DELETE RELATION ADMIN-BUILDING */
const deleteAdminBuilding = (id) => {
  return pool.query(`DELETE FROM admins_buildings WHERE admin_id IN(${id})`);
};

/* EXPORTS */
module.exports = {
  getAdmins,
  getAdminsById,
  createAdmin,
  updateAdmin,
  deleteAdmins,
};
