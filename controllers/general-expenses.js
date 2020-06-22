const pool = require('../database/db');

/* GET ALL GENERAL-EXPENSES */
const getGeneralExpenses = (req, res) => {
  const building_id = req.body;
  pool.query(
    `
    SELECT
      ge.id,
      ge.amount,
      ge.quantity,
      ge.total,
      ge.ge_date,
      ge.concept_id,
      co.code,
      co.concept,
      ge.admin_id,
      ad.first_n,
      ad.last_n,
      ge.building_id,
      bu.name
        AS building
    FROM 
      general_expenses 
      AS ge
    INNER JOIN 
      concepts
      AS co
      ON ge.concept_id = co.id
    INNER JOIN 
      admins
      AS ad
      ON ge.admin_id = ad.id
    INNER JOIN 
      buildings
      AS bu
      ON ge.building_id = bu.id
    WHERE 
      ge.building_id = ${building_id} 
    ORDER BY 
      ge.ge_date ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET GENERAL-EXPENSES BY ID */
const getGeneralExpensesById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      ge.id,
      ge.amount,
      ge.quantity,
      ge.total,
      ge.ge_date,
      ge.concept_id,
      co.code,
      co.concept,
      ge.admin_id,
      ad.first_n,
      ad.last_n,
      ge.building_id,
      bu.name
        AS building
    FROM 
      general_expenses 
      AS ge
    INNER JOIN 
      concepts
      AS co
      ON ge.concept_id = co.id
    INNER JOIN 
      admins
      AS ad
      ON ge.admin_id = ad.id
    INNER JOIN 
      buildings
      AS bu
      ON ge.building_id = bu.id
    WHERE 
      ge.id 
      IN(${id})  
    ORDER BY 
      ge.ge_date ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE GENERAL-EXPENSE */
const createGeneralExpense = (req, res) => {
  const {
    number,
    concept_id,
    amount,
    quantity,
    total,
    document,
    date,
    admin_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      general_expenses 
      (
        number, 
        concept_id, 
        amount, 
        quantity, 
        total, 
        document, 
        date, 
        admin_id, 
        building_id
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING id`,
    [
      number,
      concept_id,
      amount,
      quantity,
      total,
      document,
      date,
      admin_id,
      building_id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`
        General Expenses "${results.rows[0].id}" 
        added successfully on building: ${building_id} 
        by admin ${admin_id}`);
    }
  );
};

/* UPDATE GENERAL-EXPENSE */
const updateGeneralExpense = (req, res) => {
  const {
    id,
    number,
    concept_id,
    amount,
    quantity,
    total,
    document,
    date,
    admin_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      general_expenses 
    SET 
      number = $1,
      concept_id = $2, 
      amount = $3, 
      quantity = $4, 
      total = $5, 
      document = $6, 
      date = $7, 
      admin_id = $8, 
      building_id = $9 
    WHERE 
      id = $10`,
    [
      number,
      concept_id,
      amount,
      quantity,
      total,
      document,
      date,
      admin_id,
      building_id,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`General Expense modified with ID: ${id}`);
    }
  );
};

/* DELETE GENERAL-EXPENSES */
const deleteGeneralExpenses = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM general_expenses WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`General Expenses deleted with ID: ${id}`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getGeneralExpenses,
  getGeneralExpensesById,
  createGeneralExpense,
  updateGeneralExpense,
  deleteGeneralExpenses,
};
