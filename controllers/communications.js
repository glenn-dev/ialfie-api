const pool = require('../database/db');

/* GET ALL COMMUNICATIONS */
const getCommunications = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT
      cm.id,
      cm.release,
      cm.title,
      cm.status,
      cm.building_id,
      cm.admin_id,
      ad.first_n,
      ad.last_n
    FROM 
      communications 
      AS cm
    INNER JOIN 
      admins
      AS ad
      ON cm.admin_id = ad.id
    WHERE 
      building_id = ${building_id} 
    ORDER BY 
      release ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET COMMUNICATIONS BY ID */
const getCommunicationsById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      cm.id,
      cm.release,
      cm.title,
      cm.content,
      cm.status,
      cm.document,
      cm.building_id,
      cm.admin_id,
      ad.first_n,
      ad.last_n
    FROM 
      communications 
      AS cm
    INNER JOIN 
      admins
      AS ad
      ON cm.admin_id = ad.id
    WHERE 
      cm.id IN (${id})
    ORDER BY 
      release ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE COMMUNICATION */
const createCommunication = (req, res) => {
  const {
    release,
    title,
    content,
    status,
    document,
    admin_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      communications 
      (release, title, content, status, document, admin_id, building_id)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7)`,
    [release, title, content, status, document, admin_id, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Communication "${release}" added successfully.}`);
    }
  );
};

/* UPDATE COMMUNICATION */
const updateCommunication = (req, res) => {
  const {
    id,
    release,
    title,
    content,
    status,
    document,
    admin_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      communications 
    SET 
      release = $1, 
      title = $2, 
      content = $3, 
      status = $4, 
      document = $5, 
      admin_id = $6, 
      building_id = $7 
    WHERE 
      id = $8`,
    [release, title, content, status, document, admin_id, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Communication modified with ID: ${id}`);
    }
  );
};

/* DELETE COMMUNICATIONS */
const deleteCommunications = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM communications WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Communications deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getCommunications,
  getCommunicationsById,
  createCommunication,
  updateCommunication,
  deleteCommunications,
};
