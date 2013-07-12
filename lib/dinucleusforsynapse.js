'use strict';

var dinucleus = require('organic-dinucleus');
var synapse = require('organic-synapse');
var uuid = require('node-uuid');

function checkValid(address) {
  /* add other safe conditions here or handle the organellesMap better */
  return typeof address === 'string' && address !== '__proto__';
}

module.exports = function dinucleusforsynapse (plasma, dna) {
  var self = this;
  //make it a dinucleus
  dinucleus.call(self, plasma, dna);

  //attach changed functions
  self.addressRegister = Object.create(null);

  //attack plasma listener for addresses
  plasma.on(synapse.address.EVENT, function (chemical, callback) {
    if (checkValid(chemical.address)) {
      var organel = self.addressRegister[chemical.address];
      if (organel) {
        callback(synapse.Transport.createInProcess(organel.instance));
        return true;
      }
    }
    return false;
  });
};

module.exports.prototype = Object.create(dinucleus.prototype);
module.exports.prototype.entries = Object.create(dinucleus.prototype.entries);
module.exports.prototype.shorthand = Object.create(dinucleus.prototype.shorthand);

module.exports.prototype.resolveInjectedAddesses = function (ijson) {
  var result = {};
  for (var key in ijson) {
    result[key] = this.resolveFactory(ijson[key])().address;
  }
  return result;
};

module.exports.prototype.register = function (instance) {
  instance.address = uuid.v1();
  this.addressRegister[instance.address] = { 'instance': instance };
  return instance;
};

module.exports.prototype.getConfig = function (json) {
  var config = dinucleus.prototype.getConfig.call(this, json);
  var injections = json.injectAddress;
  if (injections) {
    var injected = this.resolveInjectedAddesses(injections);
    //copy to config
    for (var k in injected) {
      config[k] = injected[k];
    }
  }
  return config;
};

//singleton address
module.exports.prototype.entries.posa = createAddressEntry('poso');
//prototype address
module.exports.prototype.entries.popa = createAddressEntry('popo');
//prototype address
module.exports.prototype.entries.refaddr = createAddressEntry('ref');
//@ instead of # to return address
module.exports.prototype.shorthand['@'] = function (str) {
  return { _:'refaddr', 'ref': str };
};

function createAddressEntry(originalEntryName) {
  return function (json) {
    var factory = this.entries[originalEntryName].call(this, json);
    var r = function () {
      return factory().address;
    };
    r.singleton = factory.singleton;
    return r;
  };
}