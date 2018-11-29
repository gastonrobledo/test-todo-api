import express from 'express'
import path from 'path'
import APIError from '../utils/apiError'
import httpStatus from 'http-status'

class GeneralRoutes {

  constructor (app) {
    this.app = app
  }

  //Authenticated routes

  createRoutes () {

    const docPath = path.join(__dirname, '../../docs/')
    // Docs
    this.app.use ('/', express.static(docPath))

    // check for errors not being APIErrors and convert them to it
    this.app.use ((err, req, res, next) => {
      if (!(err instanceof APIError)) {
        const apiError = new APIError (err.message, err.status, err.isPublic)
        return next (apiError)
      }
      return next (err)
    })
    // If no route found trigger an APIError not found
    this.app.use ((req, res, next) => {
      const err = new APIError ('API not found', httpStatus.NOT_FOUND)
      return next (err)
    })

    this.app.use ((err, req, res, next) =>
      res.status (err.status).json ({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
      })
    )
  }
}

export default GeneralRoutes