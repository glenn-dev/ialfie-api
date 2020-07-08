const pool = require('../database/db');

/* GET ALL EXPENSES */
const getExpenses = (req, res) => {
  const {column, id} = req.body;
  pool.query(
    `
    SELECT
      ex.document,
      ex.number,
      ex.category_id,
      ex.category,
      ex.concept_id,
      ex.concept,
      ex.amount,
      ex.quantity,
      ex.total,
      ex.issue_date,
      ex.status,
      ex.expense_flag,
      ex.admin_user_id,
      us.first_name,
      us.last_name,
      us.image,
      ex.property_id,
      pr.number
        AS property_number,
      pr.property_type,
      ex.building_id
    FROM 
      expenses 
      AS ex
    INNER JOIN 
      users
      AS us
      ON ex.admin_user_id = us.id
    INNER JOIN 
      properties
      AS pr
      ON ex.property_id = pr.id
    WHERE 
      ex.${column} 
      IN(${id})
    ORDER BY 
      ex.number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* GET EXPENSES BY ID */
const getExpensesById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      ex.document,
      ex.number,
      ex.category_id,
      ex.category_code,
      ex.category,
      ex.concept_id,
      ex.concept_code,
      ex.concept,
      ex.description,
      ex.amount,
      ex.quantity,
      ex.total,
      ex.issue_date,
      ex.status,
      ex.expense_flag,
      ex.admin_user_id,
      us.first_name,
      us.last_name,
      us.image,
      ex.property_id,
      pr.number
        AS property_number,
      pr.property_type,
      ex.building_id
    FROM 
      expenses 
      AS ex
    INNER JOIN 
      users
      AS us
      ON ex.admin_user_id = us.id
    INNER JOIN 
      properties
      AS pr
      ON ex.property_id = pr.id
    WHERE 
      ex.id = ${id}
    ORDER BY 
      ex.number ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE EXPENSE */
const createExpense = (req, res) => {
  const {
    document,
    number,
    category_id,
    category_code,
    category,
    concept_id,
    concept_code,
    concept,
    description,
    amount,
    quantity,
    total,
    issue_date,
    status,
    expense_flag,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      general_expenses 
      (
        document,
        number,
        category_id,
        category_code,
        category,
        concept_id,
        concept_code,
        concept,
        description,
        amount,
        quantity,
        total,
        issue_date,
        status,
        expense_flag,
        admin_user_id,
        property_id,
        building_id
      ) 
    VALUES 
      ( 
        ${document},
        ${number},
        ${category_id},
        ${category_code},
        ${category},
        ${concept_id},
        ${concept_code},
        ${concept},
        ${description},
        ${amount},
        ${quantity},
        ${total},
        ${issue_date},
        ${status},
        ${expense_flag},
        ${admin_user_id},
        ${property_id},
        ${building_id}
      ) 
    RETURNING id`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Expenses ${results.rows[0].id} created.`);
    }
  );
};

/* UPDATE EXPENSE */
const updateExpense = (req, res) => {
  const {
    id,
    document,
    number,
    category_id,
    category_code,
    category,
    concept_id,
    concept_code,
    concept,
    description,
    amount,
    quantity,
    total,
    issue_date,
    status,
    expense_flag,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE 
      expenses 
    SET 
      document = ${document},
      number = ${number},
      category_id = ${category_id},
      category_code = ${category_code},
      category = ${category},
      concept_id = ${concept_id},
      concept_code = ${concept_code},
      concept = ${concept},
      description = ${description},
      amount = ${amount},
      quantity = ${quantity},
      total = ${total},
      issue_date = ${issue_date},
      status = ${status},
      expense_flag = ${expense_flag},
      admin_user_id = ${admin_user_id},
      property_id = ${property_id},
      building_id = ${building_id}
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Expense ${id} modified.`);
    }
  );
};

/* DELETE EXPENSES */
const deleteExpenses = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM expenses WHERE id IN(${id})`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Expenses ${id} deleted.`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getExpenses,
  getExpensesById,
  createExpense,
  updateExpense,
  deleteExpenses,
};
