const users = require('./controllers/users')

function createRouter(app) {

  app.get('/users', users.getUsers)
  app.get('/users/:id', users.getUserById)
  app.post('/users', users.createUser)
  app.put('/users/:id', users.updateUser)
  app.delete('/users/:id', users.deleteUser)

}

module.exports = createRouter;