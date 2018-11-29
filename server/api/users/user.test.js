const request = require ('supertest')
const mongoose = require('mongoose')
const app = require ('../../config/express') ()


afterAll(async () => {
  const user = mongoose.model('User')
  await user.deleteMany({})
  return app.close();
});

describe ('Users', function () {
  it ('create', async (done) => {
    const response = await request (app).post ('/api/users').send ({
      email: 'test@example.com',
      password: '123456',
      firstName: 'test',
      lastName: 'test'
    })
    expect (response.statusCode).toBe (201)
    expect (response.body.id).toBeDefined ()
    done()
  })
})