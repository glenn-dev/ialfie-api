/* PARSE BILL DETAILS QUERY */

const pool = require('../database/db');

const parseBills = (data) => {
  /* Push new 'bill' object into 'bills' array. */
  const pushBill = (bill, bills) => {
    bills.push({
      property_defaulting: bill.property_defaulting,
      property_aliquot: bill.property_aliquot,
      building_subtotal: bill.building_subtotal,
      property_subtotal: bill.property_subtotal,
      bill_details: [
        {
          expense_id: bill.expense_id,
          expense_number: bill.expense_number,
          expense_document: bill.expense_document,
          category_code: bill.category_code,
          category: bill.category,
          concept_code: bill.concept_code,
          concept: bill.concept,
          description: bill.description,
          amount: bill.amount,
          quantity: bill.quantity,
          total: bill.total,
          expense_status: bill.expense_status,
          expense_flag: bill.expense_flag,
        },
      ],
    });
  };

  /* Push 'expense' object into 'bill_details' array of 'bill' object. */
  const pushBillDetail = (bill, bills, index) => {
    bills[index].bill_details.push({
      expense_id: bill.expense_id,
      expense_number: bill.expense_number,
      expense_document: bill.expense_document,
      category_code: bill.category_code,
      category: bill.category,
      concept_code: bill.concept_code,
      concept: bill.concept,
      description: bill.description,
      amount: bill.amount,
      quantity: bill.quantity,
      total: bill.total,
      expense_status: bill.expense_status,
      expense_flag: bill.expense_flag,
    });
  };

  /* Check if 'bill' object already exist in 'bills' array. */
  const parseBills = (bill, bills) => {
    bills.find((elem) => elem.bill_id === bill.bill_id) === undefined
      ? pushBill(bill, bills)
      : pushBillDetail(bill, bills, bills.length - 1);
  };

  /* Check if data represent one or many object, then parse. */
  let bills = [];
  data.length > 1
    ? data.map((bill) => parseBills(bill, bills))
    : pushBill(data[0], bills);
  return bills;
};

const parseBuildingExpenses = (buildingExpenses) => {
  return {
    buildingExpensesId: buildingExpenses.map(
      (buildingExpense) => buildingExpense.id
    ),
    buildingSubtotal: buildingExpenses.reduce(
      (acum, elem) => acum + parseFloat(elem.total),
      0
    ),
  };
};

const parsePropertiesExpenses = (expensesArray) => {
  const buildingExpensesObj = parseBuildingExpenses(expensesArray[0].rows);

  let propertiesExpensesArr = [];

  expensesArray[1].rows.forEach((propertyExpense) => {
    if (
      propertiesExpensesArr.find(
        (elem) => elem.id === propertyExpense.propertyId
      ) === undefined
    ) {
      propertiesExpensesArr.push({
        propertyId: propertyExpense.property_id,
        propertyType: propertyExpense.property_type,
        propertyNumber: propertyExpense.property_number,
        aliquot: propertyExpense.aliquot,
        expenses: {
          buildingExpensesIdArr: buildingExpensesObj.buildingExpensesId,
          propertyExpensesIdArr: [propertyExpense.expense_id],
          buildingSubtotal:
            parseFloat(propertyExpense.aliquot) *
              buildingExpensesObj.buildingSubtotal +
            parseFloat(propertyExpense.sub_property_aliquot) *
              buildingExpensesObj.buildingSubtotal,
          propertySubtotal: parseFloat(propertyExpense.expense_total),
        },
        subProperties: [
          {
            subPropertyId: propertyExpense.sub_property_id,
            subPropertyType: propertyExpense.sub_property_type,
            subPropertyNumber: propertyExpense.subproperty_number,
            subPropertyAliquuot: propertyExpense.sub_property_aliquot,
            subPropertyExpense:
              parseFloat(propertyExpense.sub_property_aliquot) *
              buildingExpensesObj.buildingSubtotal,
          },
        ],
      });
    } else if (
      propertiesExpensesArr[
        propertiesExpensesArr.length - 1
      ].subProperties.find(
        (elem) => elem.subPropertyId === propertyExpense.sub_property_id
      ) === undefined
    ) {

      propertiesExpensesArr[
        propertiesExpensesArr.length - 1
      ].expenses.buildingSubtotal +=
        parseFloat(propertyExpense.sub_property_aliquot) *
        buildingExpensesObj.buildingSubtotal;

      propertiesExpensesArr[
        propertiesExpensesArr.length - 1
      ].subProperties.push({
        subPropertyId: propertyExpense.sub_property_id,
        subPropertyType: propertyExpense.sub_property_type,
        subPropertyNumber: propertyExpense.subproperty_number,
        subPropertyAliquuot: propertyExpense.sub_property_aliquot,
        subPropertyExpense:
          parseFloat(propertyExpense.sub_property_aliquot) *
          buildingExpensesObj.buildingSubtotal,
      });
    } else {
      propertiesExpensesArr[
        propertiesExpensesArr.length - 1
      ].expenses.propertySubtotal += parseFloat(propertyExpense.expense_total);
      propertiesExpensesArr[
        propertiesExpensesArr.length - 1
      ].expenses.propertyExpensesIdArr.push(propertyExpense.expense_id);
    }
  });

  return propertiesExpensesArr;
};

/* EXPORTS */
module.exports = {
  parseBills,
  parsePropertiesExpenses,
};
