const pool = require('../database/db');

/* GET ALL PROPERTY-TYPES */
const getPropertyTypes = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT * FROM property_types WHERE building_id = ${building_id};`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE PROPERTY-TYPE */
const createPropertyType = (req, res) => {
  const { property_type, building_id } = req.body;
  pool.query(
    `INSERT INTO
      property_types
      (property_type, building_id)
    VALUES
      ($1, $2)`,
    [property_type, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Property type ${property_type} created.`);
    }
  );
};

/* UPDATE PROPERTY-TYPE */
const updatePropertyType = (req, res) => {
  const { id, building_id, property_type } = req.body;
  pool.query(
    `
    UPDATE 
      property_types 
    SET 
      property_type = $1,
      building_id = $2
    WHERE 
      id = $3`,
    [property_type, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Property type ${id} modified.`);
    }
  );
};

/* DELETE PROPERTY-TYPES */
const deletePropertyTypes = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM property_types WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Property types ${id} deleted.`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyTypes,
};
