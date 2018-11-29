import APIError from '../../utils/apiError'
import httpStatus from 'http-status'
import { getSHA1 } from '../../utils/utils'
import { createToken } from '../../utils/tokenMiddleware'
import moment from 'moment'
import UserRepository from '../../repositories/users.repository'

class AuthController {

  constructor () {
    this.repository = new UserRepository()
  }

  checkParameters (params) {
    return !params.email || !params.password
  }

  /**
   * @api {post} /api/auth Get a token access
   * @apiName Auth
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   * @apiParam {String} Email email of the user
   * @apiParam {String} Password password of the user
   *
   * @apiSuccess {String} access_token Token generated to be used for next calls
   * @apiSuccess {String} expiration  Token expiration date
   * @apiError InvalidCredentials The <code>email</code> or <code>password</code> are invalid.
   * @apiError BadRequest there is missing required data.
   */
  async auth (req, res, next) {
    const InvalidCredentials = () => next (new APIError ('Invalid Credentials', httpStatus.UNAUTHORIZED, true))
    const BadRequest = () => next (new APIError ('Missing data', httpStatus.BAD_REQUEST, true))

    if (this.checkParameters (req.body)) {
      return BadRequest ()
    }
    try {
      const user = await this.repository.getOneByEmail (req.body.email)
      if (user) {
        let hashPassword = getSHA1 (req.body.password)
        if (user.password === hashPassword) {
          const expiration = moment ().add (12, 'h')
          const tokenData = await createToken ({
            id: user._id,
            email: user.email
          }, '12h')

          res.json ({
            token: tokenData,
            expiration
          })
        } else {
          return InvalidCredentials ()
        }
      } else {
        return InvalidCredentials ()
      }
    } catch (e) {
      return InvalidCredentials ()
    }
  }
}

export default AuthController