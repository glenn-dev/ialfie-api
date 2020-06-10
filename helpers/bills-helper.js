/* PARSE BILL DETAILS QUERY */

const goParseBills = (data) => {
  /* Push new 'bill' object into 'bills' array. */
  const pushBill = (bill, bills) => {
    bills.push({
      department_id: bill.department_id,
      department_number: bill.department_number,
      department_floor: bill.department_floor,
      department_status: bill.department_status,
      department_defaulting: bill.department_defaulting,
      department_aliquot: bill.department_aliquot,
      bill_id: bill.bill_id,
      bill_number: bill.bill_number,
      bill_status: bill.bill_status,
      bill_issued: bill.bill_issued,
      general_expense_subtotal: bill.general_expense_subtotal,
      individual_expense_subtotal: bill.individual_expense_subtotal,
      bill_total: bill.bill_total,
      exp_date: bill.exp_date,
      bill_details: [
        {
          bill_detail_id: bill.bill_detail_id,
          category_code: bill.category_code,
          category_name: bill.category_name,
          concept_code: bill.concept_code,
          concept_name: bill.concept_name,
          description: bill.description,
          amount: bill.amount,
          quantity: bill.quantity,
          total: bill.total,
        },
      ],
    });
  };

  /* Push 'bill_detail' object into a 'bill_details' array into 'bill' object on 'bills' array. */
  const pushBillDetail = (bill, bills, index) => {
    bills[index].bill_details.push({
      bill_detail_id: bill.bill_detail_id,
      category_code: bill.category_code,
      category_name: bill.category_name,
      concept_code: bill.concept_code,
      concept_name: bill.concept_name,
      description: bill.description,
      amount: bill.amount,
      quantity: bill.quantity,
      total: bill.total,
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

/* EXPORTS */
module.exports = goParseBills;
