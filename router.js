const users = require('./controllers/users');
const buildings = require('./controllers/buildings');
const admins = require('./controllers/admins');
const departments = require('./controllers/departments');
const communications = require('./controllers/communications');
const concepts = require('./controllers/concepts');

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

  /* CONCEPTS */
  app.get('/concepts', concepts.getConcepts);
  app.get('/concepts/id', concepts.getConceptsById);
  app.post('/concepts/create', concepts.createConcept);
  app.put('/concepts/update', concepts.updateConcept);
  app.delete('/concepts/delete', concepts.deleteConcepts);

};

module.exports = createRouter;