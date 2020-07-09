const pool = require('../database/db');

/* GET ALL PAYMENTS */
const getPayments = (req, res) => {
  const { column, id } = req.body;
  pool.query(
    `
    SELECT
      pa.id,
      pa.created_at,
      pa.updated_at,
      pa.document,
      pa.number,
      pa.amount,
      pa.status,
      pa.bill_id,
      bi.number
        AS bill_number,
      pa.property_id,
      pr.number
        AS property_number,
      pr.property_type,
      pa.building_id
    FROM 
      payments 
      AS pa
    INNER JOIN 
      bills
      AS bi
      ON pa.bill_id = bi.id
    INNER JOIN 
      properties
      AS pr
      ON pa.property_id = pr.id
    WHERE 
      pa.${column} 
      IN(${id}) 
    ORDER BY 
      pa.created_at ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET PAYMENT BY ID */
const getPaymentById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      pa.id,
      pa.created_at,
      pa.updated_at,
      pa.document,
      pa.number
        AS payment_number,
      pa.amount,
      pa.status,
      pa.bill_id,
      bi.number
        AS bill_number,
      bi.total
        AS bill_total,
      bi.exp_date
        AS bill_exp_date,
      pa.property_id,
      pr.number
        AS property_number,
      pr.property_type,
      pa.building_id
    FROM 
      payments 
      AS pa
    INNER JOIN 
      bills
      AS bi
      ON pa.bill_id = bi.id
    INNER JOIN 
      properties
      AS pr
      ON pa.property_id = pr.id
    WHERE 
      pa.id = ${id} 
    ORDER BY 
      pa.created_at ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE PAYMENT */
const createPayment = (req, res) => {
  const {
    document,
    number,
    amount,
    status,
    bill_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      payments 
      (
        document,
        number,
        amount,
        status,
        bill_id,
        property_id,
        building_id,
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING id`,
    [document, number, amount, status, bill_id, property_id, building_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(`Payment ${results.rows[0].id} created.`);
    }
  );
};

/* UPDATE PAYMENT */
const updatePayment = (req, res) => {
  const {
    id,
    document,
    number,
    amount,
    status,
    bill_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      payments 
    SET 
      document = ${document},
      number = ${number},
      amount = ${amount},
      status = ${status},
      bill_id = ${bill_id},
      property_id = ${property_id},
      building_id = ${building_id},
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(`Payment ${id} modified.`);
    }
  );
};

/* DELETE PAYMENTS */
const deletePayments = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM payments WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Payment ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayments,
};
