const pool = require('../database/db');

/* GET SUB-PROPERTY BY ID */
const getSubProperty = (req, res) => {
  const id = req.body;
  console.log(id);
  pool.query(
    `
    SELECT
      sp.id,
      sp.sub_property_id,
      pr.number
        AS sub_property_number,
      pr.floor
        AS sub_property_floor,
      pr.aliquot
        AS sub_property_aliquot,
      pr.status
        AS sub_property_status,
      pr.defaulting
        AS sub_property_defaulting,
      pr.property_type
        AS sub_property_type
    FROM
      sub_properties
      AS sp
    INNER JOIN
      properties
      AS pr
      ON sp.sub_property_id = pr.id
    WHERE
      sp.property_id = ${id}
    ORDER BY
      pr.number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE SUB-PROPERTY */
const createSubProperty = (req, res) => {
  const { property_id, sub_property_id } = req.body;
  pool.query(
    `
    INSERT INTO 
      sub_properties 
      (property_id, sub_property_id)
    VALUES 
      ($1, $2)`,
    [property_id, sub_property_id],
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
  const { id, property_id, sub_property_id } = req.body;
  pool.query(
    `
    UPDATE 
      sub_properties 
    SET 
      property_id = $1,
      sub_property_id = $2,
    WHERE 
      id = $3`,
    [property_id, sub_property_id, id],
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
  getSubProperty,
  createSubProperty,
  updateSubProperty,
  deleteSubProperties,
};
