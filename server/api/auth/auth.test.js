import { getSHA1 } from '../../utils/utils'
import mongoose from 'mongoose'
const request = require ('supertest')
const app = require ('../../config/express') ()

beforeEach(async () => {
  const UserModel = mongoose.model('User')
  await UserModel.deleteMany({})
  const user = new UserModel();
  user.email = 'auth@test.com'
  user.password = getSHA1('123456')
  user.firstName = 'test'
  user.lastName = 'test'
  return await user.save()
})

afterAll(async () => {
  const user = mongoose.model('User')
  await user.deleteMany({})
  return app.close();
});

describe ('Authentication', () => {

  it ('login', async (done) => {
    const response = await request (app).post ('/api/auth').send ({
      email: 'auth@test.com',
      password: '123456'
    })
    expect (response.statusCode).toBe (200)
    expect (response.body.token).toBeDefined ()
    done()
  })
})