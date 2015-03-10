
var co = require('co');

module.exports = function(timeout) {
  return function *(next) {
    var ctx = this;
    var tmr = null;
    yield Promise.race([
      new Promise(function(resolve, reject) {
        tmr = setTimeout(function() {
          var e = new Error('Request timeout');
          e.status = 408;
          reject(e);
        }, timeout);
      }),
      new Promise(function(resolve, reject) {
        co(function*() {
          yield *next;
        }).call(ctx, function(err) {
          clearTimeout(tmr);
          if(err) reject(err);
          resolve();
        });
      })
    ]);
  };
};
