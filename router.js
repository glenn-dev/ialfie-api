const countries = require('./controllers/countries');
const regions = require('./controllers/regions');
const municipalities = require('./controllers/municipalities');
const buildings = require('./controllers/buildings');
const propertyTypes = require('./controllers/property-types');
const properties = require('./controllers/properties');
const subProperties = require('./controllers/sub-properties');
const userTypes = require('./controllers/user-types');
const users = require('./controllers/users');
const liabilities = require('./controllers/liabilities');
const communications = require('./controllers/communications');
const categories = require('./controllers/categories');
const concepts = require('./controllers/concepts');
const defaultConcepts = require('./controllers/default-concepts');
const expenses = require('./controllers/expenses');
const bills = require('./controllers/bills');
const payments = require('./controllers/payments');

function createRouter(app) {
  /* COUNTRIES */
  app.get('/countries', countries.getCountries);
  app.post('/countries/create', countries.createCountry);
  app.put('/countries/update', countries.updateCountry);
  app.delete('/countries/delete', countries.deleteCountry);

  /* REGIONS */
  app.get('/regions', regions.getRegions);
  app.post('/regions/create', regions.createRegion);
  app.put('/regions/update', regions.updateRegion);
  app.delete('/regions/delete', regions.deleteRegion);

  /* MUNICIPALITIES */
  app.get('/municipalities', municipalities.getMunicipalities);
  app.post('/municipalities/create', municipalities.createMunicipality);
  app.put('/municipalities/update', municipalities.updateMunicipality);
  app.delete('/municipalities/delete', municipalities.deleteMunicipality);

  /* BUILDINGS */
  app.get('/buildings', buildings.getBuildings);
  app.get('/buildings/id', buildings.getBuildingById);
  app.post('/buildings/create', buildings.createBuilding);
  app.put('/buildings/update', buildings.updateBuilding);
  app.delete('/buildings/delete', buildings.deleteBuildings);

  /* PROPERTY-TYPES */
  app.get('/property-types', propertyTypes.getPropertyTypes);
  app.post('/property-types/create', propertyTypes.createPropertyType);
  app.put('/property-types/update', propertyTypes.updatePropertyType);
  app.delete('/property-types/delete', propertyTypes.deletePropertyTypes);

  /* PROPERTIES */
  app.get('/properties', properties.getProperties);
  app.get('/properties/id', properties.getPropertyById);
  app.post('/properties/create', properties.createProperty);
  app.put('/properties/update', properties.updateProperty);
  app.delete('/properties/delete', properties.deleteProperties);

  /* SUB-PROPERTIES */
  app.get('/sub-properties/id', subProperties.getSubProperty);
  app.post('/sub-properties/create', subProperties.createSubProperty);
  app.put('/sub-properties/update', subProperties.updateSubProperty);
  app.delete('/sub-properties/delete', subProperties.deleteSubProperties);

  /* USER-TYPES */
  app.get('/user-types', userTypes.getUserTypes);
  app.post('/user-types/create', userTypes.createUserType);
  app.put('/user-types/update', userTypes.updateUserType);
  app.delete('/user-types/delete', userTypes.deleteUserType);

  /* USERS */
  app.get('/users', users.getUsers);
  app.get('/users/id', users.getUserById);
  app.post('/users/create', users.createUser);
  app.put('/users/update', users.updateUser);
  app.delete('/users/delete', users.deleteUsers);

  /* LIABILITIES */
  app.get('/liabilities', liabilities.getLiability);
  app.post('/liabilities/create', liabilities.createLiability);
  app.put('/liabilities/update', liabilities.updateLiability);
  app.delete('/liabilities/delete', liabilities.deleteLiabilities);

  /* COMMUNICATIONS */
  app.get('/communications', communications.getCommunications);
  app.get('/communications/id', communications.getCommunicationById);
  app.post('/communications/create', communications.createCommunication);
  app.put('/communications/update', communications.updateCommunication);
  app.delete('/communications/delete', communications.deleteCommunications);

  /* CATEGORIES */
  app.get('/categories', categories.getCategories);
  app.get('/categories/id', categories.getCategoryById);
  app.post('/categories/create', categories.createCategory);
  app.put('/categories/update', categories.updateCategory);
  app.delete('/categories/delete', categories.deleteCategories);

  /* CONCEPTS */
  app.get('/concepts', concepts.getConcepts);
  app.get('/concepts/id', concepts.getConceptById);
  app.post('/concepts/create', concepts.createConcept);
  app.put('/concepts/update', concepts.updateConcept);
  app.delete('/concepts/delete', concepts.deleteConcepts);

  /* DEFAULT CONCEPTS */
  app.get('/default-concepts', defaultConcepts.getDefaultConcepts);
  app.post('/default-concepts/create', defaultConcepts.createDefaultConcept);
  app.put('/default-concepts/update', defaultConcepts.updateDefaultConcept);
  app.delete('/default-concepts/delete', defaultConcepts.deleteDefaultConcepts);

  /* EXPENSES */
  app.get('/expenses', expenses.getExpenses);
  app.get('/expenses/id', expenses.getExpenseById);
  app.post('/expenses/create', expenses.createExpense);
  app.put('/expenses/update', expenses.updateExpense);
  app.delete('/expenses/delete', expenses.deleteExpenses);

  /* BILLS */
  app.get('/bills', bills.getBills);
  app.get('/bills/id', bills.getBillById);
  app.post('/bills/create', bills.createBill);
  app.put('/bills/update', bills.updateBill);
  app.delete('/bills/delete', bills.deleteBills);

  /* PAYMENTS */
  app.get('/payments', payments.getPayments);
  app.get('/payments/id', payments.getPaymentById);
  app.post('/payments/create', payments.createPayment);
  app.put('/payments/update', payments.updatePayment);
  app.delete('/payments/delete', payments.deletePayments);
}

module.exports = createRouter;
