
var Promise = require('promise');
var co = require('co');

module.exports = function(timeout) {
  return function *(next) {
    yield Promise.race([
      new Promise(function(resolve, reject) {
        setTimeout(function() {
          var e = new Error('Request timeout')
          e.status = 408;
          reject(e);
        }, timeout);
      }),
      new Promise(function(resolve, reject) {
        co(function*() {
          yield next;
        })(function(err) {
          if(err) reject(err);
          resolve();
        });
      })
    ]);
  };
};
