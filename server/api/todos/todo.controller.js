import APIError from '../../utils/apiError'
import httpStatus from 'http-status'
import { extend } from 'lodash'
import TodoRepository from '../../repositories/todos.repository'

class TodoController {

  constructor () {
    this.repository = new TodoRepository ()
  }

  validateTodoRequest (data) {
    return !data.message
  }

  /**
   * @api {post} /api/todos create a ToDo
   * @apiName Create
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiParam {String} message
   * @apiParam {Date} due_date
   *
   * @apiSuccess {String} _id Id
   * @apiSuccess {String} message Content of todo
   * @apiSuccess {String} user Id of user owner of the todo
   * @apiSuccess {Date} due_date optional due date of the todo
   * @apiSuccess {Boolean} completed is the todo completed?
   * @apiError InternalServerError There was some issue on the api.
   * @apiError BadRequest there is missing required data.
   * @apiExample Example usage
   * curl -i -X POST -H "Authorization: Bearer [token value]" -d {"message": "test", "due_date": "2018-11-25 08:00"} 'https://localhost:5000/api/todos'
   */
  async create (req, res, next) {

    if (this.validateTodoRequest (req.body)) {
      return next (new APIError ('Invalid values', httpStatus.BAD_REQUEST))
    }

    try {
      const data = extend (req.body, {user: req.user})
      const result = await this.repository.save (data)
      res.status (201).json (result)

    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

  /**
   * @api {put} /api/todos/:idTodo update todo
   * @apiName Update
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiParam {String} idTodo id of the todo to update
   * @apiSuccess {String} todo.message Content of todo
   * @apiSuccess {Date} todo.due_date optional due date of the todo
   * @apiSuccess {Boolean} todo.completed is the todo completed?
   * @apiError InternalServerError There was some issue on the api.
   * @apiError NotFound we couldn't find any todo with that id
   *
   * @apiExample Example usage
   * curl -i -X PUT -H "Authorization: Bearer [token value]" -d {"message": "test", "completed": false, "due_date": "2018-11-25 08:00"} 'https://localhost:5000/api/todos/5bedc2dd32a9e75e052838f8'
   */

  async update (req, res, next) {
    try {
      let todo = await this.repository.update (req.params.idTodo, req.body)
      if (todo === null) {
        return next (new APIError ('Todo Not Found', httpStatus.NOT_FOUND))
      }
      res.status(200).json(todo)
    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

  /**
   * @api {get} /api/todos get all my todos
   * @apiName GetMyTodos
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiSuccess {Object[]} todo
   * @apiSuccess {String} todo._id Id
   * @apiSuccess {String} todo.message Content of todo
   * @apiSuccess {String} todo.user Id of user owner of the todo
   * @apiSuccess {Date} todo.due_date optional due date of the todo
   * @apiSuccess {Boolean} todo.completed is the todo completed?
   * @apiError InternalServerError There was some issue on the api.
   * @apiExample Example usage
   * curl -i -X GET -H "Authorization: Bearer [token value]" 'https://localhost:5000/api/todos/'
   */
  async getMyTodos (req, res, next) {

    try {
      const todos = await this.repository.allByUser(req.user.id)
      return res.status (200).json (todos)
    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

  /**
   * @api {get} /api/todos/:idTodo get one todo
   * @apiName GetOneTodo
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiSuccess {String} todo._id Id
   * @apiSuccess {String} todo.message Content of todo
   * @apiSuccess {String} todo.user Id of user owner of the todo
   * @apiSuccess {Date} todo.due_date optional due date of the todo
   * @apiSuccess {Boolean} todo.completed is the todo completed?
   * @apiError InternalServerError There was some issue on the api.
   * @apiExample Example usage
   * curl -i -X GET -H "Authorization: Bearer [token value]" 'https://localhost:5000/api/todos/5bedc2dd32a9e75e052838f8'
   */
  async getOne (req, res, next) {

    try {
      const todo = await this.repository.getOne(req.params.idTodo, req.user.id)
      if(todo !== null) {
        return res.status (200).json (todo)
      }
      return next(new APIError('Not found', httpStatus.NOT_FOUND))
    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

  /**
   * @api {patch} /api/todos/:idTodo mark todo as completed
   * @apiName MarkAsCompleted
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiParam {String} idTodo id of the todo to mark as completed
   * @apiSuccess {String} todo._id Id
   * @apiSuccess {String} todo.message Content of todo
   * @apiSuccess {String} todo.user Id of user owner of the todo
   * @apiSuccess {Date} todo.due_date optional due date of the todo
   * @apiSuccess {Boolean} todo.completed is the todo completed?
   * @apiError InternalServerError There was some issue on the api.
   * @apiError NotFound we couldn't find any todo with that id
   * @apiExample Example usage
   * curl -i -X PATCH -H "Authorization: Bearer [token value]" 'https://localhost:5000/api/todos/5bedc2dd32a9e75e052838f8'
   */
  async markAsCompleted (req, res, next) {
    try {
      let todo = await this.repository.update (req.params.idTodo, {completed: true})
      if (todo === null) {
        return next (new APIError ('Todo Not Found', httpStatus.NOT_FOUND))
      }
      res.status(200).json(todo)
    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

  /**
   * @api {delete} /api/todos/:idTodo remove todo
   * @apiName RemoveTodo
   * @apiGroup Todos
   * @apiVersion 1.0.0
   *
   * @apiParam {String} idTodo id of the todo to mark as completed
   * @apiError InternalServerError There was some issue on the api.
   * @apiError NotFound we couldn't find any todo with that id
   * @apiExample Example usage
   * curl -i -X DELETE -H "Authorization: Bearer [token value]" 'https://localhost:5000/api/todos/5bedc2dd32a9e75e052838f8'
   */
  async remove(req, res, next) {
    try {
      res.status(200).send(await this.repository.remove(req.params.idTodo))
    } catch (e) {
      return next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

}

export default TodoController