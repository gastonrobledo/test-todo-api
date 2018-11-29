import AuthClass from './auth.controller'

class AuthRoutes {

  constructor (app) {
    this.app = app
    this.AuthController = new AuthClass()
  }

  createRoutes () {
    this.app.post ('/api/auth', this.AuthController.auth.bind (this.AuthController))
  }
}

export default AuthRoutes