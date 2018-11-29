'use strict';

module.exports = {
  port: process.env.PORT || 5000,
  tokenExpiration: '12h',
  crypto: {
    algorithm: 'aes-256-ctr',
    password: '@[X6mnjKmMrN%Kt+?z8='
  }
};