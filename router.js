const users = require('./controllers/users')
const buildings = require('./controllers/buildings')
const admins = require('./controllers/admins')

function createRouter(app) {

  // BUILDINGS:
  app.get('/buildings', buildings.getBuildings)
  app.get('/buildings/id', buildings.getBuildingById)
  app.post('/buildings', buildings.createBuilding)
  app.put('/buildings/:id', buildings.updateBuilding)
  app.delete('/buildings/id', buildings.deleteBuilding)

  // USERS:
  app.get('/users', users.getUsers)
  app.get('/users/id', users.getUserById)
  app.post('/users', users.createUser)
  app.put('/users/:id', users.updateUser)
  app.delete('/users/id', users.deleteUser)

  // ADMINS:
  app.get('/admins', admins.getAdmins)
  app.get('/admins/id', admins.getAdminById)
  app.post('/admins', admins.createAdmin)
  app.put('/admins/:id', admins.updateAdmin)
  app.delete('/admins/id', admins.deleteAdmin)

}

module.exports = createRouter;