import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { secretKey } from '../config/config'
import config from '../config/config'
import { decrypt, encrypt } from '../utils/utils'

export const tokenMiddleWare = new Router().use((req, res, next) => {

  // check header or url parameters or post parameters for token
  let token = req.headers['authorization'] || req.query.token || req.body.token

  // decode token
  if (token) {
    token = token.replace('Bearer', '').trim()
    // verifies secret and checks exp
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return res.status(401).json({success: false, message: 'Failed to authenticate token.'})
      } else {
        // if everything is good, save to request for use in other routes
        req.user = JSON.parse(decrypt(decoded.data))
        next()
      }
    })

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No access token provided.'
    })

  }
})

export const createToken = (data, expiration) => {
  return new Promise((resolve, reject) => {
    const token_data = {
      data: encrypt(JSON.stringify(data))
    }
    jwt.sign(token_data, secretKey, {expiresIn: expiration || config.tokenExpiration}, (err, token) => {
      if (!err) {
        return resolve(token)
      }
      return reject(err)
    })
  })
}