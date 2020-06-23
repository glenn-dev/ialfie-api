const pool = require('../database/db');

/* GET ALL PAYMENTS */
const getPayments = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT
      pa.id,
      pa.number
        AS payment_number,
      pa.date,
      pa.amount,
      pa.bill_id,
      bi.number
        AS bill_number,
      bi.total
        AS bill_total,
      bi.status,
      pa.document,
      pa.building_id,
      bu.name,
      pa.department_id,
      de.number
        AS dep_number,
      pa.created_at,
      pa.updated_at
    FROM 
      payments 
      AS pa
    INNER JOIN 
      bills
      AS bi
      ON pa.bill_id = bi.id
    INNER JOIN 
      departments
      AS de
      ON pa.department_id = de.id
    INNER JOIN 
      buildings
      AS bu
      ON pa.building_id = bu.id
    WHERE 
      pa.building_id = ${building_id} 
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

/* GET PAYMENTS BY ID */
const getPaymentsById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      pa.id,
      pa.number
        AS payment_number,
      pa.date,
      pa.amount,
      pa.document
        AS payment_document,
      pa.bill_id,
      bi.number
        AS bill_number,
      bi.total
        AS bill_total,
      bi.status,
      bi.document
        AS bill_document,
      pa.building_id,
      bu.name,
      pa.department_id,
      de.number
        AS dep_number,
      pa.created_at,
      pa.updated_at
    FROM 
      payments 
      AS pa
    INNER JOIN 
      bills
      AS bi
      ON pa.bill_id = bi.id
    INNER JOIN 
      departments
      AS de
      ON pa.department_id = de.id
    INNER JOIN 
      buildings
      AS bu
      ON pa.building_id = bu.id
    WHERE 
      pa.id = ${id} 
    ORDER BY 
      pa.created_at ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(goParseBills(results.rows));
    }
  );
};

/* CREATE PAYMENT */
const createPayment = (req, res) => {
  const {
    number,
    date,
    amount,
    document,
    department_id,
    building_id,
    bill_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      payments 
      (
        number,
        date,
        amount,
        document,
        department_id,
        building_id,
        bill_id,
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING id`,
    [number, date, amount, document, department_id, building_id, bill_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res;
    }
  );
};

/* UPDATE PAYMENT */
const updatePayment = (req, res) => {
  const {
    id,
    number,
    date,
    amount,
    document,
    department_id,
    building_id,
    bill_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      bills 
    SET 
      number = $1,
      date = $2, 
      amount = $3, 
      document = $4, 
      department_id = $5,
      building_id = $6,
      bill_id = $7
    WHERE 
      id = $8`,
    [number, date, amount, document, department_id, building_id, bill_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res;
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
    res.status(200).send(`Payment deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getPayments,
  getPaymentsById,
  createPayment,
  updatePayment,
  deletePayments,
};
