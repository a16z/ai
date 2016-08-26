[![Build Status](https://travis-ci.org/NodeRedis/node-redis-parser.png?branch=master)](https://travis-ci.org/NodeRedis/node-redis-parser)
[![Code Climate](https://codeclimate.com/github/NodeRedis/node-redis-parser/badges/gpa.svg)](https://codeclimate.com/github/NodeRedis/node-redis-parser)
[![Test Coverage](https://codeclimate.com/github/NodeRedis/node-redis-parser/badges/coverage.svg)](https://codeclimate.com/github/NodeRedis/node-redis-parser/coverage)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# redis-parser

A high performance javascript redis parser built for [node_redis](https://github.com/NodeRedis/node_redis) and [ioredis](https://github.com/luin/ioredis). Parses all [RESP](http://redis.io/topics/protocol) data.

## Install

Install with [NPM](https://npmjs.org/):

```
npm install redis-parser
```

## Usage

```js
var Parser = require('redis-parser');

var myParser = new Parser(options);
```

### Possible options

* `returnReply`: *function*; mandatory
* `returnError`: *function*; mandatory
* `returnFatalError`: *function*; optional, defaults to the returnError function
* `returnBuffers`: *boolean*; optional, defaults to false

### Example

```js
var Parser = require("redis-parser");

function Library () {}

Library.prototype.returnReply = function (reply) { ... }
Library.prototype.returnError = function (err) { ... }
Library.prototype.returnFatalError = function (err) { ... }

var lib = new Library();

var parser = new Parser({
    returnReply: function(reply) {
        lib.returnReply(reply);
    },
    returnError: function(err) {
        lib.returnError(err);
    },
    returnFatalError: function (err) {
        lib.returnFatalError(err);
    }
});

Library.prototype.streamHandler = function () {
    this.stream.on('data', function (buffer) {
        // Here the data (e.g. `new Buffer('$5\r\nHello\r\n'`)) is passed to the parser and the result is passed to either function depending on the provided data.
        parser.execute(buffer);
    });
};
```
You do not have to use the returnFatalError function. Fatal errors will be returned in the normal error function in that case.

And if you want to return buffers instead of strings, you can do this by adding the `returnBuffers` option.

Big numbers that are too large for JS are automatically stringified.

```js
// Same functions as in the first example

var parser = new Parser({
    returnReply: function(reply) {
        lib.returnReply(reply);
    },
    returnError: function(err) {
        lib.returnError(err);
    },
    returnBuffers: true // All strings are returned as buffer e.g. <Buffer 48 65 6c 6c 6f>
});

// The streamHandler as above
```

## Protocol errors

To handle protocol errors (this is very unlikely to happen) gracefully you should add the returnFatalError option, reject any still running command (they might have been processed properly but the reply is just wrong), destroy the socket and reconnect. Note that while doing this no new command may be added, so all new commands have to be buffered in the meantime, otherwise a chunk might still contain partial data of a following command that was already processed properly but answered in the same chunk as the command that resulted in the protocol error.

## Contribute

The parser is highly optimized but there may still be further optimizations possible.

```
npm install
npm test
npm run benchmark
```

## License

[MIT](./LICENSE)
