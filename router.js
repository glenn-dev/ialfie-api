const users = require('./controllers/users');
const buildings = require('./controllers/buildings');
const admins = require('./controllers/admins');
const departments = require('./controllers/departments');

function createRouter(app) {

  /* BUILDINGS */
  app.get('/buildings', buildings.getBuildings);
  app.get('/buildings/id', buildings.getBuildingById);
  app.post('/buildings/create', buildings.createBuilding);
  app.put('/buildings/update', buildings.updateBuilding);
  app.delete('/buildings/delete', buildings.deleteBuilding);

  /* USERS */
  app.get('/users', users.getUsers);
  app.get('/users/id', users.getUserById);
  app.post('/users/create', users.createUser);
  app.put('/users/update', users.updateUser);
  app.delete('/users/delete', users.deleteUser);

  /* ADMINS */
  app.get('/admins', admins.getAdmins);
  app.get('/admins/id', admins.getAdminById);
  app.post('/admins/create', admins.createAdmin);
  app.put('/admins/update', admins.updateAdmin);
  app.delete('/admins/delete', admins.deleteAdmin);

  /* DEPARTMENTS */
  app.get('/departments', departments.getDepartments);
  app.get('/departments/id', departments.getDepartmentById);
  app.post('/departments/create', departments.createDepartment);
  app.put('/departments/update', departments.updateDepartment);
  app.delete('/departments/delete', departments.deleteDepartment);

};

module.exports = createRouter;