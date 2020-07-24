const pool = require('../database/db');

/* CREATE SUB-PROPERTY */
const createSubProperty = (req, res) => {
  const { property_id, sub_property_id, building_id } = req.body;
  pool.query(
    `
    INSERT INTO 
      sub_properties 
      (property_id, sub_property_id, building_id)
    VALUES 
      ($1, $2, $3)`,
    [property_id, sub_property_id, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Sub-property ${sub_property_id} created.`);
    }
  );
};

/* UPDATE SUB-PROPERTY */
const updateSubProperty = (req, res) => {
  const { id, property_id, sub_property_id, building_id } = req.body;
  pool.query(
    `
    UPDATE 
      sub_properties 
    SET 
      property_id = $1,
      sub_property_id = $2,
      building_id = $3,
    WHERE 
      id = $4`,
    [property_id, sub_property_id, building_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Sub-property ${sub_property_id} modified.`);
    }
  );
};

/* DELETE SUB-PROPERTIES */
const deleteSubProperties = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM sub_properties WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Sub-property ${id} deleted.`);
    }
  );
};

/* EXPORTS */
module.exports = {
  createSubProperty,
  updateSubProperty,
  deleteSubProperties,
};
