const users = require('./controllers/users');
const buildings = require('./controllers/buildings');
const admins = require('./controllers/admins');
const departments = require('./controllers/departments');

function createRouter(app) {

  // Buildings
  app.get('/buildings', buildings.getBuildings);
  app.get('/buildings/id', buildings.getBuildingById);
  app.post('/buildings', buildings.createBuilding);
  app.put('/buildings/:id', buildings.updateBuilding);
  app.delete('/buildings/id', buildings.deleteBuilding);

  // Users
  app.get('/users', users.getUsers);
  app.get('/users/id', users.getUserById);
  app.post('/users', users.createUser);
  app.put('/users/:id', users.updateUser);
  app.delete('/users/id', users.deleteUser);

  // Admins
  app.get('/admins', admins.getAdmins);
  app.get('/admins/id', admins.getAdminById);
  app.post('/admins', admins.createAdmin);
  app.put('/admins/:id', admins.updateAdmin);
  app.delete('/admins/id', admins.deleteAdmin);

  // Departments
  app.get('/departments', departments.getDepartments);
  app.get('/departments/id', departments.getDepartmentById);
  app.post('/departments', departments.createDepartment);
  app.put('/departments/:id', departments.updateDepartment);
  app.delete('/departments/id', departments.deleteDepartment);

};

module.exports = createRouter;