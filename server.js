#!/usr/bin/env node
'use strict'
/**
 * Module dependencies.
 */
import config from './server/config/config'
import cluster from 'cluster'

// Start server.
const numCPUs = Math.ceil (require ('os').cpus ().length / 2)

if (cluster.isMaster) {
  let workers = []

  // Helper function for spawning worker at index 'i'.
  const spawn = function (i) {
    workers[i] = cluster.fork ()
    console.log ('worker ' + workers[i].process.pid + ' created')

    // Optional: Restart worker on disconnect
    workers[i].on ('disconnect', function () {
      console.log ('respawning worker', i)
      spawn (i)
    })

  }

  cluster.on ('exit', function (worker) {
    console.log ('worker ' + worker.process.pid + ' died')
  })

  // Spawn workers.
  for (let i = 0; i < numCPUs; i++) {
    spawn (i)
  }
} else {

  // Init the express application
  const exp = require ('./server/config/express') ()
  const server = exp.server

  server.listen (config.port, function () {
    console.log('Register route:', exp.app)
    console.log ('server started on ' + config.port + ' port')
  })

  module.exports = server
}


