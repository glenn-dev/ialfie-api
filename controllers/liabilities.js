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
  const { member, user, liabilities, building_id, admin_user_id } = req.body;

  // Insert liabilities.
  const insertLiability = (
    liabilities,
    admin_user_id,
    user_id,
    building_id
  ) => {
    let values = [];
    liabilities.forEach((liability) => {
      values.push(
        `
        (
          ${admin_user_id},
          ${user_id},
          ${building_id},
          ${liability.user_type_id},
          ${liability.property_id},
          ${liability.status}
        )`
      );
    });

    pool.query(
      `INSERT INTO 
        liabilities 
        (
          admin_user_id,
          user_id,
          building_id,
          user_type_id,
          property_id,
          status
        ) 
      VALUES 
        ${values}
      RETURNING id`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send(`Liability ${results.rows[0].id} created.`);
      }
    );
  };

  // Insert a user with basic data, then insert liabilities.
  const insertUserLiabilities = (user) => {
    pool.query(
      `
      INSERT INTO 
      users
        (
          first_name,
          last_name,
          identity_number,
          email,
          password,
          status
        )
      VALUES
        (
          '${user.first_name}',
          '${user.last_name}',
          '${user.identity_number},
          '${user.email}',
          '${user.password}',
          '${user.status}'
        )
      RETURNING id`,
      (error, results) => {
        if (error) {
          throw error;
        }
        const user_id = results.rows[0].id;
        insertLiability(liabilities, admin_user_id, user_id, building_id);
      }
    );
  };

  member
    ? // If user is already a member then just insert liabilities.
      insertLiability(liabilities, admin_user_id, user.user_id, building_id)
    : // If user is NOT a member then insert user (basic data) and liabilities.
      insertUserLiabilities(user, liabilities, building_id, admin_user_id);
};

/* UPDATE LIABILITY */
const updateLiability = (req, res) => {
  const {
    id,
    admin_user_id,
    user_id,
    user_type_id,
    property_id,
    building_id,
    status,
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
      building_id = ${building_id},
      status = ${status}
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
