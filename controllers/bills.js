const pool = require('../database/db');
const goParseBills = require('../helpers/bills-helper');

/* GET ALL BILLS */
const getBills = (req, res) => {
  const { column, id } = req.body;
  pool.query(
    `
    SELECT
      bi.id,
      bi.number
        AS bill_number,
      bi.document,
      bi.total,
      bi.exp_date,
      bi.status,
      bi.issued,
      bi.property_id,
      pr.number
        AS property_number,
      pr.status
        AS property_status,
      pr.defaulting,
      bi.admin_user_id,
      us.first_name,
      us.last_name
    FROM 
      bills 
      AS bi
    INNER JOIN 
      properties
      AS pr
      ON bi.property_id = pr.id
    INNER JOIN 
      users
      AS us
      ON bi.admin_user_id = us.id
    INNER JOIN 
      buildings
      AS bu
      ON bi.building_id = bu.id
    WHERE 
      bi.${column}
      IN(${id}) 
    ORDER BY 
      bi.number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET BILLS BY ID */
const getBillsById = (req, res) => {
  const bill_id = req.body;
  pool.query(
    `
    SELECT
      bi.id,
      bi.created_at,
      bi.updated_at,
      bi.building_subtotal,
      bi.property_subtotal,
      pr.defaulting
        AS property_defaulting,
      pr.aliquot
        AS property_aliquot,
      bd.id
      bd.bill_id,
      bd.bd_expense_id,
      ex.id
        AS expense_id,
      ex.number
        AS expense_number,
      ex.document
        AS expense_document,
      ex.category_code,
      ex.category,
      ex.concept_code,
      ex.concept,
      ex.description,
      ex.amount,
      ex.quantity,
      ex.total,
      ex.status
        AS expense_status,
      ex.expense_flag
    FROM 
      bill_details
      AS bd
    INNER JOIN 
      bills
      AS bi
      ON bd.bill_id = bi.id
    INNER JOIN 
      properties
      AS pr
      ON bi.property_id = pr.id
    INNER JOIN  
      expenses
      AS ex
      ON bd.expense_id = ex.id
    WHERE 
      bd.bill_id = ${bill_id}
    ORDER BY 
      bi.id ASC`, // Delete bi.id, bd.id, bd.bill_id and bd.bd_expense_id at the end of the sprint.
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(goParseBills(results.rows));
    }
  );
};

/* CREATE BILL */
const createBill = (req, res) => {
  const {
    number,
    exp_date,
    building_subtotal,
    property_subtotal,
    total,
    status,
    issued,
    document,
    details,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      bills 
      (
        number, 
        exp_date, 
        building_subtotal, 
        property_subtotal, 
        total, 
        status, 
        issued, 
        document, 
        admin_user_id, 
        property_id, 
        building_id, 
      ) 
    VALUES 
      (
        ${number},
        ${exp_date},
        ${building_subtotal},
        ${property_subtotal},
        ${total},
        ${status},
        ${issued},
        ${document},
        ${admin_user_id},
        ${property_id},
        ${building_id},
      ) 
    RETURNING id`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const id = results.rows[0].id;
      insertBillDetails(id, details)
        .then(res.status(201).send(`Bill ${id} created.`))
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* CREATE RELATIONS */
const insertBillDetails = (bill_id, details) => {
  let values = [];
  details.forEach((expense_id) => {
    values.push(`(${bill_id}, ${expense_id})`);
  });
  return pool.query(
    `
    INSERT INTO 
      bill_details 
      (bill_id, expense_id) 
    VALUES 
      ${values}
    RETURNING id`
  );
};

/* UPDATE BILL */
const updateBill = (req, res) => {
  const {
    id,
    number,
    exp_date,
    building_subtotal,
    property_subtotal,
    total,
    status,
    issued,
    document,
    details,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      bills 
    SET 
      number = ${number},
      exp_date = ${exp_date},
      building_subtotal = ${building_subtotal},
      property_subtotal = ${property_subtotal},
      total = ${total},
      status = ${status},
      issued = ${issued},
      document = ${document},
      admin_user_id =${admin_user_id},
      property_id = ${property_id},
      building_id = ${building_id},
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      deleteBillDetails(id)
        .then(
          insertBillDetails(id, details)
            .then(res.status(201).send(`Bill ${id} updated.`))
            .catch((err) => {
              throw err;
            })
        )
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* DELETE BILLS */
const deleteBills = (req, res) => {
  const id = req.body;
  deleteBillDetails(id)
    .then(
      pool.query(`DELETE FROM bills WHERE id IN(${id})`, (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).send(`Bills deleted with ID: ${id}`);
      })
    )
    .catch((err) => {
      throw err;
    });
};

/* DELETE RELATIONS */
const deleteBillDetails = (id) => {
  return pool.query(`DELETE FROM bill_details WHERE bill_id IN(${id})`);
};

/* EXPORTS */
module.exports = {
  getBills,
  getBillsById,
  createBill,
  updateBill,
  deleteBills,
};
