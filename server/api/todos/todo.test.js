import mongoose from 'mongoose'
import { getSHA1 } from '../../utils/utils'

const request = require ('supertest')
const app = require ('../../config/express')()
const moment = require('moment')


let token = ''
beforeAll(async (done) => {
  const UserModel = mongoose.model('User')
  await UserModel.deleteMany({})
  const user = new UserModel();
  user.email = 'auth@test.com'
  user.password = getSHA1('123456')
  user.firstName = 'test'
  user.lastName = 'test'
  await user.save()
  done()
})

beforeEach(async (done) => {
  const response = await request (app).post ('/api/auth').send ({
    email: 'auth@test.com',
    password: '123456'
  })
  token = response.body.token
  done()
})

afterAll(async () => {
  const todos = mongoose.model('Todo')
  await todos.deleteMany({})
  const user = mongoose.model('User')
  await user.deleteMany({})
  return app.close();
});

let id = ''

describe ('Todos', function () {

  it('create a todo', async (done) => {
    const date = moment().format('YYYY-MM-DD HH:mm')
    const msg = 'This is my todo message'
    const response = await request (app)
    .post ('/api/todos').send ({
      message: msg,
      due_date: date
    })
    .set({ Authorization: 'Bearer ' + token })
    expect (response.statusCode).toBe (201)
    expect(moment(response.body.due_date).format('YYYY-MM-DD HH:mm')).toBe(date)
    expect(response.body.message).toBe(msg)
    expect(response.body.createdAt).toBeDefined()
    expect(response.body._id).toBeDefined()
    id = response.body._id
    done()
  })
  it('update a todo', async (done) => {
    const msg = 'This is my todo message 2'
    const response = await request (app)
    .put ('/api/todos/' + id).send ({
      message: msg
    })
    .set({ Authorization: 'Bearer ' + token })
    expect (response.statusCode).toBe (200)
    expect(response.body.message).toBe(msg)
    done()
  })

  it('mark todo as completed', async (done) => {
    const response = await request (app)
    .patch ('/api/todos/' + id)
    .set({ Authorization: 'Bearer ' + token })
    expect (response.statusCode).toBe (200)
    expect(response.body.completed).toBe(true)
    done()
  })

  it('delete a todo', async (done) => {
    const response = await request (app)
    .del ('/api/todos/' + id)
    .set({ Authorization: 'Bearer ' + token })
    expect(response.statusCode).toBe(200)
    done()
  })
})