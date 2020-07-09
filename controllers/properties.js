const pool = require('../database/db');

/* GET ALL PROPERTIES */
const getProperties = (req, res) => {
  const { column, id } = req.body;
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
      pr.property_type_id,
      pr.building_id,
    FROM 
      properties 
      AS pr
    WHERE 
      pr.${column}
      IN(${id}) 
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

/* GET PROPERTIES BY ID */
const getPropertiesById = (req, res) => {
  const { column, id } = req.body;
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
      pr.property_type_id,
      pr.building_id,
    FROM 
      properties 
      AS pr
    WHERE 
      pr.${column}
      IN(${id}) 
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
        property_type, 
        property_type_id, 
        building_id
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7)`,
    [
      number,
      floor,
      aliquot,
      status,
      defaulting,
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
          `Property ${number}, added successfully on building ${building_id}`
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
      property_type = $6
      property_type_id = $7, 
      building_id = $8
    WHERE 
      id = $9`,
    [
      number,
      floor,
      aliquot,
      status,
      defaulting,
      property_type,
      property_type_id,
      building_id,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Property modified with ID: ${id}`);
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
    res.status(200).send(`Property deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getProperties,
  getPropertiesById,
  createProperty,
  updateProperty,
  deleteProperties,
};
