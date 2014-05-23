
var koa = require('koa');
var timeout = require('../');
var request  = require('supertest');

describe('timeout', function() {
  var app, server;
  before(function startServer() {
    app = koa();
    app.use(tryCatch);
    app.use(timeout(500));
    app.use(function *() {
      if(this.path === '/timeout')
        yield function(done) {
          setTimeout(done, 1000);
        };
      if(this.path === '/error')
        this.throw('Error !!');

      this.status = 200;
      this.body = 'No errors here';
    });
    server = app.listen(8943);
  });
  after(function closeServer() {
    server.close();
  });

  it('is catchable by koa/co', function(done) {
    request(server).get('/timeout').expect(408, 'Request timeout', done);
  });
  it('doesn\'t interfere with throws', function(done) {
    request(server).get('/error').expect(500, 'Error !!', done);
  });
  it('responds normally when no timeout occurs', function(done){
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
