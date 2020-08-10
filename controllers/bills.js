const pool = require('../database/db');
const {
  parseBills,
  parsePropertiesExpenses,
} = require('../helpers/bills-helper');

/* GET ALL BILLS */
const getBills = (req, res) => {
  const { column, id } = req.body;
  pool.query(
    `
    SELECT
      bi.id,
      bi.created_at,
      bi.updated_at,
      bi.document,
      bi.number
        AS bill_number,
      bi.total,
      bi.exp_date,
      bi.status,
      bi.issued,
      bi.property_id,
      pr.number
        AS property_number,
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
const getBillById = (req, res) => {
  const id = req.body;
  pool.query(
    `
    SELECT
      bi.id,
      bi.created_at,
      bi.updated_at,
      bi.document,
      bi.number
        AS bill_number,
      bi.building_subtotal,
      bi.property_subtotal,
      bi.total,
      bi.exp_date,
      bi.status,
      bi.issued,
      bi.property_id,
      pr.number
        AS property_number,
      pr.defaulting,
      pr.status
        AS property_status,
      pr.defaulting
        AS property_defaulting,
      pr.aliquot
        AS property_aliquot,
      bi.admin_user_id,
      us.first_name,
      us.last_name
      bd.bill_id,
      bd.expense_id,
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
      bd.bill_id = ${id}
    ORDER BY 
      bi.id ASC`, // Delete bi.id, bd.id, bd.bill_id and bd.bd_expense_id at the end of the sprint.
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows); // goParseBills(results.rows)
    }
  );
};

/* CREATE BILL */
const createBill = (req, res) => {
  const {
    document,
    number,
    buildingSubtotal,
    propertySubtotal,
    total,
    expirationDate,
    status,
    issued,
    adminUserId,
    propertyId,
    buildingId,
    billDetails,
  } = req.body;
  pool.query(
    `
    INSERT INTO
      bills
      (
        document,
        number,
        building_subtotal,
        property_subtotal,
        total,
        exp_date,
        status,
        issued,
        admin_user_id,
        property_id,
        building_id
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    RETURNING id`,
    [
      document,
      number,
      buildingSubtotal,
      propertySubtotal,
      total,
      expirationDate,
      status,
      issued,
      adminUserId,
      propertyId,
      buildingId,
      billDetails,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      const id = results.rows[0].id;
      insertBillDetails(id, billDetails)
        .then(res.status(201).send(`Bill ${id} created.`))
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* MONTHLY BILLING */
const monthlyBilling = (req, res) => {
  const { buildingId, adminUserId, firstParam, secondParam } = req.body;

  /* Get all building expenses */
  const getBuildingExpenses = (buildingId, firstParam, secondParam) => {
    let secondaryQuery = 'AND status = false';
    if (firstParam) {
      secondaryQuery = `AND issue_date BETWEEN ${firstParam} AND ${secondParam}`;
    }
    return pool.query(
      `
      SELECT
        id,
        total
      FROM
        expenses
      WHERE
        building_id = ${buildingId}
        AND expense_flag = true
        ${secondaryQuery}
      `
    );
  };

  /* Get all properties and their expenses */
  const getPropertiesExpenses = (buildingId) => {
    return pool.query(
      `
      SELECT
        pr.id
          AS property_id,
        pt.property_type
          AS property_type,
        pr.number
          AS property_number,
        pr.aliquot,
        sp.sub_property_id,
        spt.property_type
          AS sub_property_type,
        spr.number
          AS sub_property_number,
        spr.aliquot
          AS sub_property_aliquot,
        ex.id
        AS expense_id,
        ex.number
          AS expense_number,
        ex.total
          AS expense_total
      FROM
        properties
        AS pr
      INNER JOIN
        property_types
        AS pt
        ON pr.property_type_id = pt.id
      INNER JOIN
        sub_properties
        AS sp
        ON sp.property_id = pr.id
      INNER JOIN
        properties
        AS spr
        ON sp.sub_property_id = spr.id
      INNER JOIN
        property_types
        AS spt
        ON spr.property_type_id = spt.id
      INNER JOIN
        expenses
        AS ex
        ON ex.property_id = pr.id
      WHERE
        pr.building_id = ${buildingId}
        AND pr.main_property_flag = true
      ORDER BY
        pr.id ASC
      `
    );
  };

  /* CALLS */
  Promise.all([
    getBuildingExpenses(buildingId, firstParam, secondParam),
    getPropertiesExpenses(buildingId),
  ])
    .then((expensesArray) => {

      const propertiesExpensesArr = parsePropertiesExpenses(expensesArray);
      res.status(201).send(propertiesExpensesArr);
      //res.status(201).send(expensesArray[1].rows);
      
    })
    .catch((error) => {
      throw error;
    });

  /*   pool.query(
    `
    INSERT INTO
      bills
      (
        document,
        number,
        building_subtotal,
        property_subtotal,
        total,
        exp_date,
        status,
        issued,
        admin_user_id,
        property_id,
        building_id
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    RETURNING id`,
    [
      document,
      number,
      buildingSubtotal,
      propertySubtotal,
      total,
      expirationDate,
      status,
      issued,
      adminUserId,
      propertyId,
      buildingId,
      billDetails,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      const id = results.rows[0].id;
      insertBillDetails(id, billDetails)
        .then(res.status(201).send(`Bill ${id} created.`))
        .catch((err) => {
          throw err;
        });
    }
  ); */
};

/* CREATE RELATIONS */
const insertBillDetails = (billId, details) => {
  let values = [];
  details.forEach((expenseId) => {
    values.push(`(${billId}, ${expenseId})`);
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
  getBillById,
  createBill,
  updateBill,
  deleteBills,
  monthlyBilling,
};
