Stream Spigot
=============

[![NPM](https://nodei.co/npm/stream-spigot.png)](https://nodei.co/npm/stream-spigot/)

[![david-dm](https://david-dm.org/brycebaril/node-stream-spigot.png)](https://david-dm.org/brycebaril/node-stream-spigot/)
[![david-dm](https://david-dm.org/brycebaril/node-stream-spigot/dev-status.png)](https://david-dm.org/brycebaril/node-stream-spigot#info=devDependencies/)


A generator for (streams2) Readable streams, useful for testing or converting simple lazy functions into Readable streams, or just creating Readable streams without all the boilerplate.

```javascript
var spigot = require("stream-spigot")

spigot.array(["ABCDEFG"]).pipe(process.stdout)
// ABCDEFG

spigot.array(["ABC", "DEF", "G"]).pipe(process.stdout)
// same as: (short form)
spigot(["ABC", "DEF", "G"]).pipe(process.stdout)
// ABCDEFG


// Create a stream out of a synchronous generator:
var count = 0
function gen() {
  if (count++ < 5) {
    return {val: count}
  }
}

spigot.sync({objectMode: true}, gen).pipe(...)
/*
{val: 1}
{val: 2}
{val: 3}
{val: 4}
{val: 5}
*/


// Create a more traditional Readable stream:
var source = spigot({objectMode: true}, function () {
  var self = this
  iterator.next(function (err, value) {
    if (err) return self.emit("error", err)
    self.push(value)
  })
})

source.pipe(...)

```

Usage
=====

spigot([options,] _read)
---

Create a Readable stream instance with the specified _read method. Your _read method should follow the normal [stream.Readable _read](http://nodejs.org/api/stream.html#stream_readable_read_size_1) syntax. (I.e. it should call `this.push(chunk)`)

spigot([options, ], array)
---

Create a Readable stream instance that will emit each member of the specified array until it is consumed. Creates a copy of the given array and consumes that -- if this will cause memory issues, consider implementing your own _read function to consume your array.

var Spigot = spigot.ctor([options,], _read)
---

Same as the above except provides a constructor for your Readable class. You can then create instances by using either `var source = new Spigot()` or `var source = Spigot()`.

var Spigot = spigot.ctor([options,], array)
---

Same as the above except provides a constructor for your Readable class. You can then create instances by using either `var source = new Spigot()` or `var source = Spigot()`.

spigot.array([options, ], array)
---

A manual version of the above to specify an array.


spigot.sync([options,] fn)
------------------------

Create a readable instance providing a synchronous generator function. It will internally wrap your synchronous function as an async function.

Options
-------

Accepts standard [readable-stream](http://npmjs.org/api/stream.html) options.

LICENSE
=======

MIT
