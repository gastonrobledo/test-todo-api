import APIError from '../../utils/apiError'
import httpStatus from 'http-status'
import UserRepository from '../../repositories/users.repository'

class UserController {

  constructor () {
    this.repository = new UserRepository ()
  }

  validateUserRequest (data) {
    return !data.email || !data.password || !data.firstName || !data.lastName
  }

  /**
   * @api {post} /api/users create a user
   * @apiName Create
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   * @apiParam {String} email user's email
   * @apiParam {String} firstName user's first name
   * @apiParam {String} lastName user's last name
   * @apiParam {String} password user's password
   * @apiSuccess {String} _id user id
   * @apiError InternalServerError There was some issue on the api.
   *
   * @apiExample Example usage
   * curl -i -X POST -d {"email": "test@example.com", "firstName": "John", "lastName": "Doe", "password": "testPassword"} 'https://localhost:5000/api/users'
   */
  async create (req, res, next) {

    if (this.validateUserRequest (req.body)) {
      return next (new APIError ('Invalid values', httpStatus.BAD_REQUEST))
    }
    try {
      const u = await this.repository.checkExists (req.body.email)
      if (u) {
        return next (new APIError ('User already exists', httpStatus.BAD_REQUEST))
      }
      const result = await this.repository.save (req.body)
      res.status (201).json ({id: result._id})
    } catch (e) {
      next (new APIError (e.message, httpStatus.INTERNAL_SERVER_ERROR))
    }
  }

}

export default UserController