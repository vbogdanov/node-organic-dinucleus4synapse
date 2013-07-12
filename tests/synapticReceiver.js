//duplicate of organel in dinucleus/tests
/* global module: true */
'use strict';

module.exports = function (plasma, config) {
  this.config = config;
  this.message = function (data) {
    config.messaged(data);
  };
};