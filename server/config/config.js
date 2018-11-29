import { extend, union, isString, isArray } from 'lodash'
import all from './env/all'
import { config as dev } from './env/development'
import { config as prod } from './env/production'
import { config as staging } from './env/staging'
import { config as testing } from './env/test'
import glob from 'glob'

let local_config = dev

if (process.env.NODE_ENV === 'production') {
  local_config = prod
} else if (process.env.NODE_ENV === 'staging') {
  local_config = staging
} else if (process.env.NODE_ENV === 'testing') {
  local_config = testing
}

module.exports = extend (
  all,
  local_config
)

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
  // For context switching
  var _this = this

  // URL paths regex
  var urlRegex = new RegExp ('^(?:[a-z]+:)?//', 'i')

  // The output array
  var output = []

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (isArray (globPatterns)) {
    globPatterns.forEach (function (globPattern) {
      output = union (output, _this.getGlobbedFiles (globPattern, removeRoot))
    })
  } else if (isString (globPatterns)) {
    if (urlRegex.test (globPatterns)) {
      output.push (globPatterns)
    } else {
      var files = glob (globPatterns, {
        sync: true
      })
      if (removeRoot) {
        files = files.map (function (file) {
          return file.replace (removeRoot, '')
        })
      }

      output = union (output, files)
    }
  }

  return output
}

module.exports.secretKey = 'Th151S-Sp@rT@MTF'
