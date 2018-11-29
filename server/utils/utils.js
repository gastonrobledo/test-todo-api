import crypto from 'crypto'
import config from '../config/config'

export const getSHA1 = (string) => {
  return crypto.createHash('sha1').update(string).digest('hex')
}

export const encrypt = (text) => {
  const cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.password)
  return cipher.update(text,'utf8','hex') + cipher.final('hex')
}

export const decrypt = (text) => {
  const decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.password)
  return decipher.update(text,'hex','utf8') + decipher.final('utf8')
}