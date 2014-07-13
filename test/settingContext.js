
var koa = require('koa');
var timeout = require('../');
var request  = require('supertest');

describe('timeout', function() {
  var app, server;
  before(function startServer() {
    'use strict'
    app = koa();
    app.use(tryCatch);
    app.use(timeout(500));
    app.use(function *() {
      yield function *() {
        if (this === global || this === undefined)
          throw '`this` is global or undefined';
        if (!(this.set && this.get && this.request && this.response))
          throw '`this` is not a Koa context';
      };
      this.status = 200;
      this.body = 'No errors here';
    });
    server = app.listen(8943);
  });
  after(function closeServer() {
    server.close();
  });

  it('properly sets context, which is passed to `co` yieldables', function(done){
    request(server).get('/').expect(200, 'No errors here', done);
  });
});

function * tryCatch(next) {
  try {
    yield next;
  } catch(e) {
    this.status = e.status || 500;
    this.body = e.message;
  }
}
