//duplicate of organel in dinucleus/tests
module.exports = function (plasma, config) {
  this.config = config;
  this.message = function (data) {
    config.messaged(data);
  };
}