const pool = require('../database/db');

/* GET ALL PROPERTIES */
const getProperties = (req, res) => {
  const {building_id, column, id} = req.body;
  pool.query(
    `
    SELECT 
      id,
      number,
      floor,
      aliquot,
      status,
      defaulting,
      main_property_flag,
      property_type,
      property_type_id,
      building_id
    FROM
      properties
    WHERE
      building_id = ${building_id}
      ${column} = ${id}
    ORDER BY 
      number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET PROPERTY BY ID */
const getPropertyById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      pr.id,
      pr.number,
      pr.floor,
      pr.aliquot,
      pr.status,
      pr.defaulting,
      pr.property_type,
      us.first_name,
      us.last_name,
      us.identity_number,
      us.phone,
      us.email,
      us.status
        AS user_status,
      sp.sub_property_id,
      spr.number
        AS sub_property_number,
      spr.floor
        AS sub_property_floor,
      spr.aliquot
        AS sub_property_aliquot,
      spr.status
        AS sub_property_status,
      spr.defaulting
        AS sub_property_defaulting,
      spr.property_type
        AS sub_property_type,
    FROM
      properties
      AS pr
    INNER JOIN
      liabilities
      AS li
      ON pr.id = li.property_id
    INNER JOIN
      users
      AS us
      ON li.user_id = us.id
    INNER JOIN
      sub_properties
      AS sp
      ON sp.property_id = pr.id
    INNER JOIN
      properties
      AS spr
      ON spr.sub_property_id = pr.id
    WHERE
      pr.id = ${id}
    ORDER BY
      number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE PROPERTY */
const createProperty = (req, res) => {
  const {
    number,
    floor,
    aliquot,
    status,
    defaulting,
    main_property_flag,
    property_type,
    property_type_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      properties 
      (
        number, 
        floor, 
        aliquot, 
        status, 
        defaulting,
        main_property_flag,
        property_type, 
        property_type_id, 
        building_id
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      number,
      floor,
      aliquot,
      status,
      defaulting,
      main_property_flag,
      property_type,
      property_type_id,
      building_id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .send(
          `Property ${number} created.`
        );
    }
  );
};

/* UPDATE PROPERTY */
const updateProperty = (req, res) => {
  const {
    id,
    number,
    floor,
    aliquot,
    status,
    defaulting,
    main_property_flag,
    property_type,
    property_type_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      properties 
    SET 
      number = $1, 
      floor = $2, 
      aliquot = $3, 
      status = $4, 
      defaulting = $5, 
      main_property_flag = $6,
      property_type = $7,
      property_type_id = $8, 
      building_id = $9
    WHERE 
      id = $10`,
    [
      number,
      floor,
      aliquot,
      status,
      defaulting,
      main_property_flag,
      property_type,
      property_type_id,
      building_id,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Property ${number} modified.`);
    }
  );
};

/* DELETE PROPERTIES */
const deleteProperties = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM properties WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Property ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperties,
};
