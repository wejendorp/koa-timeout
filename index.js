
var Promise = require('promise');
var co = require('co');

module.exports = function(timeout) {
  return function *(next) {
    yield Promise.race([
      new Promise(function(resolve, reject) {
        setTimeout(function() {
          reject('Request timed out');
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
