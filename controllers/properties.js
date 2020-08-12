const pool = require('../database/db');

/* GET ALL PROPERTIES */
const getProperties = (req, res) => {
  const { buildingId, status, index = 0, params } = req.body;
  const queryArray = [
    '',
    `AND pr.number similar to '%${params}%'`,
    `AND pr.floor = '${params}'`,
    `AND pr.defaulting = ${params}`,
    `AND pr.property_type_id = ${params}`,
  ];

  pool.query(
    `
    SELECT 
      pr.id,
      pt.property_type,
      pr.number,
      pr.floor,
      pr.aliquot,
      pr.status,
      pr.defaulting,
      pr.property_type_id,
      pr.building_id
    FROM
      properties
      AS pr
    INNER JOIN
      property_types
      AS pt
      ON pr.property_type_id = pt.id
    WHERE
      pr.building_id = ${buildingId}
      AND pr.status = ${status}
      ${queryArray[index]}
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

/* GET PROPERTY BY ID */
const getPropertyById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT 
      pr.id,
      pt.property_type,
      pr.number,
      pr.floor,
      pr.aliquot,
      pr.status,
      pr.defaulting,
      pr.property_type_id,
      pr.building_id,
      spr.id
        AS sub_property_id,
      spt.property_type
        AS sub_property_type,
      spr.number
        AS sub_property_number,
      spr.floor
        AS sub_property_floor,
      spr.aliquot
        AS sub_property_aliquot,
      li.user_id,
      us.image,
      us.first_name,
      us.last_name,
      us.email,
      ut.user_type
    FROM
      properties
      AS pr
    INNER JOIN
      property_types
      AS pt
      ON pr.property_type_id = pt.id
    LEFT JOIN
      sub_properties
      AS spr
      ON spr.property_id = pr.id
    LEFT JOIN
      property_types
      AS spt
      ON spr.property_type_id = spt.id
    LEFT JOIN
      liabilities
      AS li
      ON li.property_id = pr.id
    LEFT JOIN
      users
      AS us
      ON li.user_id = us.id
    LEFT JOIN
      user_types
      AS ut
      ON li.user_type_id = ut.id
    WHERE
      pr.id = ${id}
    ORDER BY 
      pr.number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

/* INSERT SUB-PROPERTIES */
const insertSubProperties = (subProperties, propertyId) => {
  let values = [];
  subProperties.forEach((subProperty) => {
    values.push(`(
      ${subProperty.number},
      ${subProperty.floor},
      ${subProperty.aliquot},
      ${subProperty.status},
      ${subProperty.propertyTypeId},
      ${propertyId}
    )`);
  });
  return pool.query(
    `
    INSERT INTO 
      sub_properties 
      (
        number,
        floor,
        aliquot,
        status,
        property_type_id,
        property_id
      )
    VALUES 
      ${values}
    RETURNING id`
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
    subProperties,
    propertyTypeId,
    buildingId,
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
        property_type_id,
        building_id
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id`,
    [number, floor, aliquot, status, defaulting, propertyTypeId, buildingId],
    (error, results) => {
      if (error) {
        throw error;
      }
      const propertyId = results.rows[0].id;
      insertSubProperties(subProperties, propertyId)
        .then((response) => {
          console.log(response);
          res
            .status(201)
            .send(
              `Property ${propertyId} created. ${response.rows.length} Relations added.`
            );
        })
        .catch((error) => {
          throw error;
        });
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
    subProperties,
    propertyTypeId,
    buildingId,
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
      property_type_id = $6, 
      building_id = $7
    WHERE 
      id = $8`,
    [
      number,
      floor,
      aliquot,
      status,
      defaulting,
      propertyTypeId,
      buildingId,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      deleteSubProperties(id)
        .then(
          insertSubProperties(subProperties, id)
            .then(res.status(200).send(`Property ${id} modified.`))
            .catch((error) => {
              throw error;
            })
        )
        .catch((error) => {
          throw error;
        });
    }
  );
};

/* DELETE PROPERTIES */
const deleteProperties = (req, res) => {
  const id = req.body;
  deleteSubProperties(id)
    .then(
      pool.query(
        `DELETE FROM properties WHERE id IN(${id})`,
        (error, results) => {
          if (error) {
            throw error;
          }
          res.status(200).send(`Property ${id} deleted.`);
        }
      )
    )
    .catch((error) => {
      throw error;
    });
};

/* DELETE SUB-PROPERTIES */
const deleteSubProperties = (id) => {
  return pool.query(`DELETE FROM sub_properties WHERE property_id IN(${id})`);
};

/* EXPORTS */
module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperties,
};
