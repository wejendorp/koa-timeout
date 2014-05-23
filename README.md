# koa-timeout

Timeout middleware for koa.

Will throw "Request timeout" (Http 408) for any requests that take too long.

## Installation

    $ npm install koa-timeout

## Example
If we always want to respond within half a second, we could use `timeout(500)`
as middleware after our error handler:

```js
var koa = require('koa');
var timeout = require('koa-timeout')(500);

var app = koa();
app.use(function * tryCatch(next) {
  try {
    yield next;
  } catch(e) {
    this.status = e.status || 500;
    this.body = e.message;
  }
});

app.use(timeout);

// Some potentially slow logic:
app.use(function * () {
  yield function(done) {
    setTimeout(done, 1000);
  };
});

app.listen(3000);
```

## License

MIT
