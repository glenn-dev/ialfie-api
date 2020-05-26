const pool = require('../database/db')

/* GET ALL BILLS */
const getBills = (req, res) => {
  const building_id = req.body;
  pool.query(`
  SELECT
    bi.id,
    bi.bill_number,
    bi.exp_date,
    bi.total,
    bi.status,
    bi.document,
    bi.department_id,
    de.number
      AS dep_number,
    de.defaulting,
    bi.admin_id,
    ad.first_n
      AS adm_first_n,
    ad.last_n
      AS adm_last_n,
    bi.building_id,
    bd.b_name
  FROM bills 
    AS bi
    INNER JOIN departments
      AS de
      ON bi.department_id = de.id
    INNER JOIN admins
      AS ad
      ON bi.admin_id = ad.id
    INNER JOIN buildings
      AS bd
      ON bi.building_id = bd.id
  WHERE bi.building_id = ${building_id} 
  ORDER BY bi.bill_number ASC`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* GET BILLS BY ID */
const getBillsById = (req, res) => {
  const id = req.body
  pool.query(`
    SELECT
      bd.id,
      bd.category_id,
      ca.cat_code,
      ca.cat_name,
      bd.concept_id,
      co.code,
      co.concept,
      bd.description,
      bd.amount,
      bd.quantity,
      bd.total,
    FROM bill_details
      AS bd
      INNER JOIN concepts
        AS co
        ON bd.concept_id = co.id
      INNER JOIN categories
        AS ca
        ON bd.category_id = ca.id
    WHERE bd.id IN(${id}) 
    ORDER BY ca.cat_name ASC`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE BILL */
const createBill = (req, res) => {
  const { bill_number, exp_date, total, status, document, department_id, building_id, admin_id } = req.body;
  pool.query(`
    INSERT INTO bills (bill_number, exp_date, total, status, document, department_id, building_id, admin_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, 
     [bill_number, exp_date, total, status, document, department_id, building_id, admin_id], 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(201).send(`Bill "${bill_number}" added successfully on department: ${department_id}, by admin: ${admin_id}`);
    }
  );
};

/* UPDATE BILL */
const updateBill = (req, res) => {
  const { id, bill_number, exp_date, total, status, document, department_id, building_id, admin_id } = req.body;
  pool.query(`
    UPDATE bills 
    SET 
      bill_number = $1,
      exp_date = $2, 
      total = $3, 
      status = $4, 
      document = $5, 
      department_id = $6, 
      building_id = $7, 
      admin_id = $8
    WHERE id = $9`,
    [bill_number, exp_date, total, status, document, department_id, building_id, admin_id, id],
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Bill modified with ID: ${id}`);
    }
  );
};

/* DELETE BILLS */
const deleteBills = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM bills WHERE id IN(${id})`, 
    (error, results) => {
      if (error) {
        throw error;
      };
      res.status(200).send(`Bills deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getBills,
  getBillsById,
  createBill,
  updateBill,
  deleteBills,
};