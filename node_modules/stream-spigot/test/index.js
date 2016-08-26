var test = require("tape").test
var concat = require("concat-stream")

var spigot = require("../")

test("simple", function (t) {
  t.plan(1)

  var content = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  function match(d) {
    t.equals(d.toString(), content)
  }

  var s = spigot.array([content]).pipe(concat(match))
})

test("chunked", function (t) {
  t.plan(1)

  var content = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  function match(d) {
    t.equals(d.toString(), content)
  }

  var s = spigot.array(["ABCDEFG","HIJKLMNOPQ","RSTUVWXYZ"]).pipe(concat(match))
})

test("chunked auto-detect array", function (t) {
  t.plan(1)

  var content = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  function match(d) {
    t.equals(d.toString(), content)
  }

  var s = spigot(["ABCDEFG","HIJKLMNOPQ","RSTUVWXYZ"]).pipe(concat(match))
})

test("chunked auto-detect array objectMode", function (t) {
  t.plan(1)

  var input = [{cats: "meow", dogs: "woof"}, {birds: "tweet", elephant: "toot"}]

  function match(d) {
    t.deepEquals(d, input)
  }

  var s = spigot.array({objectMode: true}, input).pipe(concat(match))
})

test("null in array", function (t) {
  t.plan(1)

  var content = "AB"

  function match(d) {
    t.equals(d.toString(), content)
  }

  var s = spigot.array(["A", "B", null, "C"]).pipe(concat(match))
})

test("objectMode", function (t) {
  t.plan(1)

  var input = {cats: "meow", dogs: "woof"}

  function match(d) {
    t.equals(d[0], input)
  }

  var s = spigot.array({objectMode: true}, [input]).pipe(concat(match))
})

test("function", function (t) {
  t.plan(1)

  var c = 0
  var fn = function () {
    if (c++ < 5) {
      return c.toString()
    }
  }

  function match(d) {
    t.equals(d.toString(), "12345")
  }

  var s = spigot.sync(fn).pipe(concat(match))
})

test("async", function (t) {
  t.plan(1)

  var c = 0
  var fn = function (cb) {
    var self = this
    if (c++ < 5) {
      setTimeout(function () {
        self.push(c.toString())
      }, 10)
    }
    else {
      setTimeout(function () {
        self.push(null)
      }, 10)
    }
  }

  function match(d) {
    t.equals(d.toString(), "12345")
  }

  var s = spigot(fn).pipe(concat(match))
})

test("async objectMode", function (t) {
  t.plan(1)

  var c = 0
  var fn = function (cb) {
    var self = this
    if (c++ < 5) {
      setTimeout(function () {
        self.push(c)
      }, 10)
    }
    else {
      setTimeout(function () {
        self.push(null)
      }, 10)
    }
  }

  function match(d) {
    t.deepEquals(d, [1, 2, 3, 4, 5])
  }

  var s = spigot({objectMode: true}, fn).pipe(concat({encoding: "object"}, match))
})

test("async ctor", function (t) {
  t.plan(1)

  var c = 0
  var fn = function (cb) {
    var self = this
    if (c++ < 5) {
      setTimeout(function () {
        self.push(c.toString())
      }, 10)
    }
    else {
      setTimeout(function () {
        self.push(null)
      }, 10)
    }
  }

  function match(d) {
    t.equals(d.toString(), "12345")
  }
  var spig = spigot.ctor(fn)
  var s = spig().pipe(concat(match))
})

test("function objectMode", function (t) {
  t.plan(1)

  var c = 0
  var fn = function () {
    if (c++ < 5) {
      return {val: c}
    }
  }

  function match(d) {
    t.deepEquals(d, [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}])
  }

  var s = spigot.sync({objectMode: true}, fn).pipe(concat(match))
})
