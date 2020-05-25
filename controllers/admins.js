const pool = require('../database/db');
const parseAdmins = require('../helpers/admins-helper');

/* GET ALL ADMINS */
const getAdmins = (req, res) => {
  pool.query(`
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
      bd.b_name,
	    bd.address
    FROM admins
      AS ad
      INNER JOIN admins_buildings
        AS ab
        ON ad.id = ab.admin_id
      INNER JOIN buildings
        AS bd
        ON ab.building_id = bd.id
    ORDER BY ad.first_n ASC;`,
   (error, results) => {
    if (error) {
      throw error;
    };
    res.status(200).json(parseAdmins(results.rows));
  });
};

/* GET ADMINS BY ID */
const getAdminsById = (req, res) => {
  const id = req.body;
  pool.query(`
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
      bd.b_name,
	    bd.address
    FROM admins
      AS ad
      INNER JOIN admins_buildings
        AS ab
        ON ad.id = ab.admin_id
      INNER JOIN buildings
        AS bd
        ON ab.building_id = bd.id
    WHERE ad.id IN(${id})
    ORDER BY ad.first_n ASC;`, 
    (error, results) => {
    if (error) {
      throw error;
    };
    res.status(200).json(parseAdmins(results.rows));
  });
};

/* CREATE RELATIONS */
const insertAdminBuilding = (id, buildings) => {
  let values = [];
  buildings.forEach((building, index) => {
    (buildings.length < index) ? values.push(`(${id}, ${building}),`) : values.push(`(${id}, ${building})`)
  });
  pool.query(
    `INSERT INTO admins_buildings (admin_id, building_id) VALUES ${values}`, 
    (error, results) => {
    if (error) {
      throw error;
    };
  });
};

/* DELETE RELATIONS */
const deleteAdminBuilding = (id) => {
  pool.query(`DELETE FROM admins_buildings WHERE admin_id IN(${id})`, 
  (error, results) => {
    if (error) {
      throw error;
    };
  });
};

/* CREATE ADMIN */
const createAdmin = (req, res) => {
  const { first_n, last_n, email, password, phone, id_number, buildings, status } = req.body;
  pool.query(
    'INSERT INTO admins (first_n, last_n, email, password, phone, id_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
    [first_n, last_n, email, password, phone, id_number, status],
    (error, results) => {
      if (error) {
        throw error;
      };
      const id = results.rows[0].id;
      insertAdminBuilding(id, buildings);
      res.status(201).send(`Admin "${first_n} ${last_n}" with ID: ${id} and buildings: ${buildings} added  successfully.`);
    }
  );
};

/* UPDATE ADMIN */
const updateAdmin = (req, res) => {
  const { id, first_n, last_n, email, password, phone, id_number, status, buildings } = req.body;
  pool.query(
    'UPDATE admins SET first_n = $1, last_n = $2, email = $3, password = $4, phone = $5, id_number = $6, status = $7 WHERE id = $8',
    [first_n, last_n, email, password, phone, id_number, status, id],
    (error, results) => {
      if (error) {
        throw error;
      };
    }
  );
  deleteAdminBuilding(id);
  insertAdminBuilding(id, buildings);
  res.status(201).send(`Admin "${first_n} ${last_n}" with ID: ${id} and buildings: ${buildings} modified  successfully.`);
};

/* DELETE ADMINS */
const deleteAdmins = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM admins WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    };
    deleteAdminBuilding(id);
    res.status(200).send(`Admins deleted with ID: ${id}. All relations removed.`);
  });
};

/* EXPORTS */
module.exports = {
  getAdmins,
  getAdminsById,
  createAdmin,
  updateAdmin,
  deleteAdmins,
};