const pool = require('../database/db');

/* GET ALL EXPENSES */
const getExpenses = (req, res) => {
  const {
    building_id,
    startingDate,
    endingDate,
    expense_flag,
    index = '0',
    firstParam,
    secondParam,
  } = req.body;
  const queryArray = [
    '',
    `AND ex.number similar to '%${firstParam}%'`,
    `AND ex.total BETWEEN ${firstParam} AND ${secondParam}`,
    `AND ex.status = ${firstParam}`,
    `AND ex.property_id = ${firstParam}`,
  ];

  pool.query(
    `
    SELECT
      ex.id,
      ex.document,
      ex.number,
      ex.total,
      ex.issue_date,
      ex.status,
      ex.expense_flag,
      ex.admin_user_id,
      ex.property_id,
      pt.property_type,
      pr.number
        AS property_number,
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
    INNER JOIN
      property_types
      AS pt
      ON pr.property_type_id = pt.id
    WHERE
      ex.issue_date 
        BETWEEN '${startingDate}' 
        AND '${endingDate}'
      AND ex.expense_flag = ${expense_flag}
      AND ex.building_id = ${building_id}
      ${queryArray[index]}
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

/* GET EXPENSE BY ID */
const getExpenseById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      ex.document,
      ex.number,
      ex.category_id,
      ca.code
        AS category_code,
      ca.category,
      ex.concept_id,
      co.code
        AS concept_code,
      co.concept,
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
      pt.property_type,
      pr.number
        AS property_number,
      ex.building_id
    FROM
      expenses
      AS ex
    INNER JOIN
      categories
      AS ca
      ON ex.category_id = ca.id
    INNER JOIN
      concepts
      AS co
      ON ex.concept_id = co.id
    INNER JOIN 
      users
      AS us
      ON ex.admin_user_id = us.id
    INNER JOIN 
      properties
      AS pr
      ON ex.property_id = pr.id
    INNER JOIN
      property_types
      AS pt
      ON pr.property_type_id = pt.id
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
    description,
    amount,
    quantity,
    total,
    issue_date,
    status,
    expense_flag,
    category_id,
    concept_id,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      expenses 
      (
        document,
        number,
        description,
        amount,
        quantity,
        total,
        issue_date,
        status,
        expense_flag,
        category_id,
        concept_id,
        admin_user_id,
        property_id,
        building_id
      ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING id`,
    [
      document,
      number,
      description,
      amount,
      quantity,
      total,
      issue_date,
      status,
      expense_flag,
      category_id,
      concept_id,
      admin_user_id,
      property_id,
      building_id,
    ],
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
    description,
    amount,
    quantity,
    total,
    issue_date,
    status,
    expense_flag,
    category_id,
    concept_id,
    admin_user_id,
    property_id,
    building_id,
  } = req.body;
  pool.query(
    `
    UPDATE
      expenses
    SET
      document = $1,
      number = $2,
      description = $3,
      amount = $4,
      quantity = $5,
      total = $6,
      issue_date = $7,
      status = $8,
      expense_flag = $9,
      category_id = $10,
      concept_id = $11,
      admin_user_id = $12,
      property_id = $13,
      building_id = $14
    WHERE
      id = $15`,
    [
      document,
      number,
      description,
      amount,
      quantity,
      total,
      issue_date,
      status,
      expense_flag,
      category_id,
      concept_id,
      admin_user_id,
      property_id,
      building_id,
      id,
    ],
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
  pool.query(`DELETE FROM expenses WHERE id IN(${id})`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Expenses ${id} deleted.`);
  });
};

/* EXPORTS */
module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpenses,
};
