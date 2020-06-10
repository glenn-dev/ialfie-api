const users = require('./controllers/users');
const buildings = require('./controllers/buildings');
const admins = require('./controllers/admins');
const departments = require('./controllers/departments');
const communications = require('./controllers/communications');
const categories = require('./controllers/categories');
const concepts = require('./controllers/concepts');
const generalExpenses = require('./controllers/general-expenses');
const bills = require('./controllers/bills');

function createRouter(app) {
  /* BUILDINGS */
  app.get('/buildings', buildings.getBuildings);
  app.get('/buildings/id', buildings.getBuildingsById);
  app.post('/buildings/create', buildings.createBuilding);
  app.put('/buildings/update', buildings.updateBuilding);
  app.delete('/buildings/delete', buildings.deleteBuildings);

  /* USERS */
  app.get('/users', users.getUsers);
  app.get('/users/id', users.getUsersById);
  app.post('/users/create', users.createUser);
  app.put('/users/update', users.updateUser);
  app.delete('/users/delete', users.deleteUsers);

  /* ADMINS */
  app.get('/admins', admins.getAdmins);
  app.get('/admins/id', admins.getAdminsById);
  app.post('/admins/create', admins.createAdmin);
  app.put('/admins/update', admins.updateAdmin);
  app.delete('/admins/delete', admins.deleteAdmins);

  /* DEPARTMENTS */
  app.get('/departments', departments.getDepartments);
  app.get('/departments/id', departments.getDepartmentsById);
  app.post('/departments/create', departments.createDepartment);
  app.put('/departments/update', departments.updateDepartment);
  app.delete('/departments/delete', departments.deleteDepartments);

  /* COMMUNICATIONS */
  app.get('/communications', communications.getCommunications);
  app.get('/communications/id', communications.getCommunicationsById);
  app.post('/communications/create', communications.createCommunication);
  app.put('/communications/update', communications.updateCommunication);
  app.delete('/communications/delete', communications.deleteCommunications);

  /* CATEGORIES */
  app.get('/categories', categories.getCategories);
  app.get('/categories/id', categories.getCategoriesById);
  app.post('/categories/create', categories.createCategory);
  app.put('/categories/update', categories.updateCategory);
  app.delete('/categories/delete', categories.deleteCategories);

  /* CONCEPTS */
  app.get('/concepts', concepts.getConcepts);
  app.get('/concepts/id', concepts.getConceptsById);
  app.post('/concepts/create', concepts.createConcept);
  app.put('/concepts/update', concepts.updateConcept);
  app.delete('/concepts/delete', concepts.deleteConcepts);

  /* GENERAL-EXPENSES */
  app.get('/general-expenses', generalExpenses.getGeneralExpenses);
  app.get('/general-expenses/id', generalExpenses.getGeneralExpensesById);
  app.post('/general-expenses/create', generalExpenses.createGeneralExpense);
  app.put('/general-expenses/update', generalExpenses.updateGeneralExpense);
  app.delete('/general-expenses/delete', generalExpenses.deleteGeneralExpenses);

  /* BILLS */
  app.get('/bills', bills.getBills);
  app.get('/bills/id', bills.getBillsById);
  app.post('/bills/create', bills.createBill);
  app.put('/bills/update', bills.updateBill);
  app.delete('/bills/delete', bills.deleteBills);
}

module.exports = createRouter;
