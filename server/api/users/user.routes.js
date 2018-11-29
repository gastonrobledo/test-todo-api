import UserClass from './user.controller'

class UserRoutes {

  constructor (app) {
    this.app = app
    this.UserController = new UserClass()
  }

  createRoutes () {
    // ToDos
    this.app.post ('/api/users', this.UserController.create.bind (this.UserController))
  }
}

export default UserRoutes