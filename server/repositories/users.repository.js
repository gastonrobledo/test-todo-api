import UserModel from '../models/user.model'
import { getSHA1 } from '../utils/utils'

class UserRepository {

  async checkExists (email) {
    let user = await this.getOneByEmail(email)
    return user !== null
  }

  async getOneByEmail (email) {
    return UserModel.findOne({email: email})
  }

  async save(data) {
    let user = new UserModel ()
    user.email = data.email
    user.password = getSHA1 (data.password)
    user.firstName = data.firstName
    user.lastName = data.lastName
    return await user.save ()
  }

}

export default UserRepository