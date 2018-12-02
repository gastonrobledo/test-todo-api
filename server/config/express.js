// modules =================================================
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import fs from 'fs'
import path from 'path'
import spdy from 'spdy'
import responseTime from 'response-time'
import methodOverride from 'method-override'
import { create as createDomain } from 'domain'
import GeneralRoutes from '../routes/api.routes'
import config from './config'
import mongoose from 'mongoose'
import bluebird from 'bluebird'

module.exports = function () {

  const app = express()

  app.use(cors())
  app.use(responseTime())

  // get all data/stuff of the body (POST) parameters
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  app.use(bodyParser.json({type: 'application/vnd.api+json'})) // parse application/vnd.api+json as json
  app.use(methodOverride('X-HTTP-Method-Override')) // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

  // Showing stack errors
  app.set('showStackError', true)

  // Enable jsonp
  app.enable('jsonp callback')

  // Use helmet to secure Express headers
  app.use(helmet.xframe())
  app.use(helmet.iexss())
  app.use(helmet.contentTypeOptions())
  app.use(helmet.ienoopen())
  app.disable('x-powered-by')

  app.use(function (req, res, next) {
    // Prepare Domain for error handling
    let domain = createDomain()
    domain.add(req)
    domain.add(res)
    domain.on('error', function (err) {
      next(err)
    })

    // Passing the request url to environment locals
    res.locals.url = req.protocol + ':// ' + req.headers.host + req.url

    return next()
  })



  // Load services routes
  config.getGlobbedFiles('../api/**/*.routes.js').forEach(async (routePath) => {
    let routeClass = require(path.resolve(routePath)).default
    const r = new routeClass(app)
    r.createRoutes()
  });

  const routes = new GeneralRoutes(app)
  routes.createRoutes()

  console.log(app)


  let options = {}
  if(process.env.NO_SSL === 'true'){
    options = {
      spdy:{
        plain: true,
        ssl: false
      }
    }
  } else {
    options = {
      key: fs.readFileSync(__dirname + '/certs/server.key'),
      cert: fs.readFileSync(__dirname + '/certs/server.crt')
    }
  }

  mongoose.Promise = bluebird

// Bootstrap db connection
  mongoose.connect (config.db, {
    useMongoClient: true
  })
  mongoose.set ('debug', !!process.env.DEBUG_DB)

  return spdy.createServer(options, app)
}