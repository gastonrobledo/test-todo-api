import TodoModel from '../models/todo.model'
import { extend } from 'lodash'
import APIError from '../utils/apiError'
import httpStatus from 'http-status'

class TodoRepository {

  async getOne(id) {
    return await TodoModel.findOne({_id: id})
  }

  async save(data) {
    let todo = new TodoModel ()
    todo.message = data.message
    todo.user = data.user.id
    todo.due_date = data.due_date
    todo.completed = data.completed

    return await todo.save ()
  }

  async update(id, data) {
    let t = await this.getOne(id)
    if(t) {
      t = extend(t, data)
      return await t.save ()
    }else {
      return null
    }
  }

  async allByUser (userId) {
    return TodoModel.find ({user: userId})
  }

  async remove (id) {
    return await TodoModel.deleteOne ({_id: id})
  }

}

export default TodoRepository