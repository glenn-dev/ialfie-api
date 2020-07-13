const pool = require('../database/db');

/* GET ALL LIABILITY */
const getLiability = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      li.id,
      li.created_at,
      li.updated_at,
      li.admin_user_id,
      ua.image
        AS admin_image,
      ua.first_name
        AS adm_first_name,
      ua.last_name
        AS adm_last_name,
      li.user_id,
      us.image
        AS user_image,
      us.first_name
        AS user_first_name,
      us.last_name
        AS user_last_name,
      us.email,
      us.phone,
      li.user_type_id,
      ut.user_type,
      li.property_id,
      pr.number,
      pr.floor,
      pr.aliquot,
      pr.status,
      pr.defaulting,
      pr.property_type,
      li.sub_property_id,
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
      li.building_id,
    FROM 
      liabilities 
      AS li
    INNER JOIN
      users
      AS ua
      IN li.admin_user_id = ua.id
    INNER JOIN 
      users
      AS us
      ON li.user_id = us.id
    INNER JOIN
      user_types
      AS ut
      IN li.user_type_id = ut.id
    INNER JOIN
      properties
      AS pr
      IN li.property_id = pr.id
    INNER JOIN
      properties
      AS spr
      IN li.sub_property_id = spr.id
    WHERE 
      li.id = ${id} 
    ORDER BY 
      li.building_id ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE LIABILITY */
const createLiability = (req, res) => {
  const {
    admin_user_id,
    user_id,
    user_type_id,
    property_id,
    sub_property_id,
    building_id,
  } = req.body;
  pool.query(
    `INSERT INTO 
      liabilities 
      (
        admin_user_id,
        user_id,
        user_type_id,
        property_id,
        sub_property_id,
        building_id,
      ) 
    VALUES 
      (
        admin_user_id = ${admin_user_id},
        user_id = ${user_id},
        user_type_id = ${user_type_id},
        property_id = ${property_id},
        sub_property_id = ${sub_property_id},
        building_id = ${building_id},
      )
    RETURNING id`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Liability ${results.rows[0].id} added successfully.`);
    }
  );
};

/* UPDATE LIABILITY */
const updateLiability = (req, res) => {
  const {
    id,
    admin_user_id,
    user_id,
    user_type_id,
    property_id,
    sub_property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      concepts 
    SET 
      admin_user_id = ${admin_user_id},
      user_id = ${user_id},
      user_type_id = ${user_type_id},
      property_id = ${property_id},
      sub_property_id = ${sub_property_id},
      building_id = ${building_id},
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Liability ${id} modified.`);
    }
  );
};

/* DELETE LIABILITIES */
const deleteLiabilities = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM liabilities WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Liabilities ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getLiability,
  createLiability,
  updateLiability,
  deleteLiabilities,
};
