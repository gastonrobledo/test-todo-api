import TodoClass from './todo.controller'
import { tokenMiddleWare } from '../../utils/tokenMiddleware'

class TodoRoutes {

  constructor (app) {
    this.app = app
    this.TodoController = new TodoClass()
  }

  createRoutes () {
    // ToDos
    this.app.post ('/api/todos', tokenMiddleWare, this.TodoController.create.bind (this.TodoController))
    this.app.get ('/api/todos', tokenMiddleWare, this.TodoController.getMyTodos.bind (this.TodoController))
    this.app.patch ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.markAsCompleted.bind (this.TodoController))
    this.app.put ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.update.bind (this.TodoController))
    this.app.delete ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.remove.bind (this.TodoController))
    this.app.get ('/api/todos/:idTodo', tokenMiddleWare, this.TodoController.getOne.bind (this.TodoController))
  }
}

export default TodoRoutes