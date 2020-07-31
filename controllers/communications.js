const pool = require('../database/db');

/* GET ALL COMMUNICATIONS */
const getCommunications = (req, res) => {
  const { building_id, index, params } = req.body;
  const queryArray = [
    `AND cm.created_at >= '${params}'`,
    `AND cm.release similar to '%${params}%'`,
    `AND cm.title similar to '%${params}%')`,
    `AND cm.status = ${params}`,
    `AND cm.admin_user_id = ${params}`,
  ]; 

  pool.query(
    `
    SELECT
      cm.id,
      cm.created_at,
      cm.updated_at,
      cm.document,
      cm.release,
      cm.title,
      cm.validity,
      cm.status,
      cm.user_type_id
        AS sent_to_user_type_id,
      cm.admin_user_id,
      us.first_name,
      us.last_name,
      cm.building_id
    FROM 
      communications 
      AS cm
    INNER JOIN 
      users
      AS us
      ON cm.admin_user_id = us.id
    WHERE
      cm.building_id = ${building_id}
      ${queryArray[index]}
    ORDER BY 
      cm.release ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET COMMUNICATION BY ID */
const getCommunicationById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      cm.id,
      cm.created_at,
      cm.updated_at,
      cm.document,
      cm.release,
      cm.title,
      cm.content,
      cm.validity,
      cm.status,
      cm.user_type_id
        AS sent_to_user_type_id,
      cm.admin_user_id,
      us.first_name,
      us.last_name,
      cm.building_id
    FROM
      communications
      AS cm
    INNER JOIN
      users
      AS us
      ON cm.admin_user_id = us.id
    WHERE
      cm.id = ${id}
    ORDER BY
      cm.release ASC;`,
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
    document,
    release,
    title,
    content,
    validity,
    status,
    user_type_id,
    admin_user_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      communications 
      (
        document, 
        release, 
        title, 
        content,
        validity, 
        status, 
        user_type_id, 
        admin_user_id, 
        building_id
      )
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      document,
      release,
      title,
      content,
      validity,
      status,
      user_type_id,
      admin_user_id,
      building_id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Communication "${release}" added successfully.`);
    }
  );
};

/* UPDATE COMMUNICATION */
const updateCommunication = (req, res) => {
  const {
    id,
    document,
    release,
    title,
    content,
    validity,
    status,
    user_type_id,
    admin_user_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      communications 
    SET 
      document = $1, 
      release = $2, 
      title = $3, 
      content = $4,
      validity = $5, 
      status = $6,
      user_type_id = $7, 
      admin_user_id = $8, 
      building_id = $9 
    WHERE 
      id = $10`,
    [
      document,
      release,
      title,
      content,
      validity,
      status,
      user_type_id,
      admin_user_id,
      building_id,
      id,
    ],
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
  getCommunicationById,
  createCommunication,
  updateCommunication,
  deleteCommunications,
};
