module.exports = make
module.exports.ctor = ctor

module.exports.array = array
module.exports.sync = sync

const Readable = require("readable-stream/readable")
    , inherits = require("util").inherits
    , xtend    = require("xtend")
    , setImmediate = global.setImmediate || process.nextTick

function ctor (options, _read) {
  if (_read == null) {
    _read    = options
    options   = {}
  }

  if (Array.isArray(_read))
    _read = _shifter(_read)

  if (typeof _read != "function")
    throw new Error("You must implement an _read function for Spigot")

  function Spigot (override) {
    if (!(this instanceof Spigot))
      return new Spigot(override)

    this.options = xtend(options, override)
    Readable.call(this, this.options)
  }

  inherits(Spigot, Readable)

  Spigot.prototype._read = _read

  return Spigot
}

function make(options, _read) {
  return ctor(options, _read)()
}

function _shifter(array) {
  var copy = array.slice(0)
  return function _shift() {
    var self = this
    setImmediate(function later() {
      // var val = copy.shift()
      // if (val === undefined) {
      //   val = null
      // }
      // self.push(val)
      self.push(copy.shift())
    })
  }
}

function array(options, array) {
  if (Array.isArray(options)) {
    array = options
    options = {}
  }

  return make(options, _shifter(array))
}

function sync(options, fn) {
  if (typeof options == "function") {
    fn = options
    options = {}
  }
  var toAsync = function toAsync() {
    var self = this
    setImmediate(function later() {
      self.push(fn())
    })
  }
  return make(options, toAsync)
}
