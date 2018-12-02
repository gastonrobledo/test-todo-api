import express from 'express'
import path from 'path'
import APIError from '../utils/apiError'
import httpStatus from 'http-status'
import UserCtrl from '../api/users/user.controller'
import TodoCtrl from '../api/todos/todo.controller'
import AuthCtrl from '../api/auth/auth.controller'
import { tokenMiddleWare } from '../utils/tokenMiddleware'

class GeneralRoutes {

  constructor (app) {
    this.app = app
    this.UserController = new UserCtrl()
    this.TodoController = new TodoCtrl()
    this.AuthController = new AuthCtrl()
  }

  //Authenticated routes

  createRoutes () {

    const docPath = path.join(__dirname, '../../docs/')
    // Docs
    this.app.use ('/', express.static(docPath))

    this.app.post ('/api/auth', this.AuthController.auth.bind (this.AuthController))

    this.app.post ('/api/users', this.UserController.create.bind (this.UserController))

    this.app.post ('/api/todos', tokenMiddleWare, this.TodoController.create.bind (this.TodoController))
    this.app.get ('/api/todos', tokenMiddleWare, this.TodoController.getMyTodos.bind (this.TodoController))
    this.app.patch ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.markAsCompleted.bind (this.TodoController))
    this.app.put ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.update.bind (this.TodoController))
    this.app.delete ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.remove.bind (this.TodoController))
    this.app.get ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.getOne.bind (this.TodoController))

    // check for errors not being APIErrors and convert them to it
    this.app.use ((err, req, res, next) => {
      if (!(err instanceof APIError)) {
        const apiError = new APIError (err.message, err.status, err.isPublic)
        return next (apiError)
      }
      return next (err)
    })
    // If no route found trigger an APIError not found
    this.app.use ((req, res, next) => {
      const err = new APIError ('API not found', httpStatus.NOT_FOUND)
      return next (err)
    })

    this.app.use ((err, req, res, next) =>
      res.status (err.status).json ({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
      })
    )
  }
}

export default GeneralRoutes