const pool = require('../database/db');

/* GET ALL PROPERTIES */
const getProperties = (req, res) => {
  const { building_id, column, id } = req.body;
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
      AND
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
  const { id, main_property_flag } = req.body;

  let propertyIdToGet;
  let givenIdProperty;

  if (main_property_flag) {
    givenIdProperty = 'property';
    propertyIdToGet = 'sub_property';
  } else {
    givenIdProperty = 'sub_property';
    propertyIdToGet = 'property';
  }

  const relatedProperties = (id, propertyIdToGet, givenIdProperty) => {
    let relProperties;
    return pool.query(
      `
    SELECT 
      pr.id,
      pr.number,
      pr.floor,
      pr.aliquot,
      pr.status,
      pr.defaulting,
      pr.main_property_flag,
      pr.property_type,
      pr.property_type_id
    FROM
      sub_properties
      AS sp
    INNER JOIN
      properties
      AS pr
      ON sp.${propertyIdToGet}_id = pr.id
    WHERE
      sp.${givenIdProperty}_id = ${id}
    ORDER BY
      pr.number ASC`
    );
  };

  const propertyUsers = (id) => {
    return pool.query(
      `
    SELECT 
      us.id,
      us.created_at,
      us.updated_at,
      us.image,
      us.first_name,
      us.last_name,
      us.identity_number,
      us.phone,
      us.email,
      us.status,
      ut.user_type
    FROM
      liabilities
      AS li
    INNER JOIN
      users
      AS us
      ON li.user_id = us.id
    INNER JOIN
      user_types
      AS ut
      ON li.user_type_id = ut.id
    WHERE
      li.property_id = ${id}
    ORDER BY
      us.first_name ASC`
    );
  };

  Promise.all([
    relatedProperties(id, propertyIdToGet, givenIdProperty),
    propertyUsers(id),
  ])
    .then((values) => {
      console.log(values);
      const response = {
        relatedPropertiesArr: values[0].rows,
        propertyUsersArr: values[1].rows,
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      throw error;
    });
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
      res.status(201).send(`Property ${number} created.`);
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
      res.status(200).send(`Property ${id} modified.`);
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
