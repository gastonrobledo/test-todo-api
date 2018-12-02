#!/usr/bin/env node
'use strict'
/**
 * Module dependencies.
 */
import config from './server/config/config'
// import cluster from 'cluster'

// Start server.
/*const numCPUs = Math.ceil (require ('os').cpus ().length / 2)

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
} else { */

  // Init the express application
  const exp = require ('./server/config/express') ()
  const server = exp.server





  server.listen (config.port, function () {
    console.log ('server started on ' + config.port + ' port')

    var route, routes = [];
    exp.app._router.stack.forEach(function(middleware){
      if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
      } else if(middleware.name === 'router'){ // router middleware
        middleware.handle.stack.forEach(function(handler){
          route = handler.route;
          route && routes.push(route);
        });
      }
    });

    routes.forEach(function(temp){
      var methods = "";
      for(var method in temp.methods){
        methods += method + ", ";
      }
      console.log(temp.path + ": " + methods);
    });
  })

  module.exports = server
///}


