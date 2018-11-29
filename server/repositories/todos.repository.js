import TodoModel from '../models/todo.model'
import { extend } from 'lodash'
import APIError from '../utils/apiError'
import httpStatus from 'http-status'

class TodoRepository {

  async getOne(id, userId) {
    let query = {_id: id}
    if(userId) {
      query = extend(query, {user: userId})
    }
    return await TodoModel.findOne(query)
  }

  async save(data) {
    let todo = new TodoModel ()
    todo.message = data.message
    todo.user = data.user.id
    todo.due_date = data.due_date
    todo.completed = data.completed

    return await todo.save ()
  }

  async update(id, data, userId) {
    let t = await this.getOne(id, userId)
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