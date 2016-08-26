'use strict'

var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder()
var ReplyError = require('./replyError')
var bufferPool = new Buffer(32 * 1024)
var bufferOffset = 0
var interval = null
var counter = 0
var notDecreased = 0

/**
 * Used for lengths and numbers only, faster perf on arrays / bulks
 * @param parser
 * @returns {*}
 */
function parseSimpleNumbers (parser) {
  var offset = parser.offset
  var length = parser.buffer.length
  var number = 0
  var sign = false

  if (parser.buffer[offset] === 45) {
    sign = true
    offset++
  }

  while (offset < length) {
    var c1 = parser.buffer[offset++]
    if (c1 === 13 && parser.buffer[offset] === 10) { // \r\n
      parser.offset = offset + 1
      return sign ? -number : number
    }
    number = (number * 10) + (c1 - 48)
  }
}

/**
 * Used for integer numbers in case of the returnNumbers option
 * @param parser
 * @returns {*}
 */
function parseStringNumbers (parser) {
  var offset = parser.offset
  var length = parser.buffer.length
  var number = ''

  if (parser.buffer[offset] === 45) {
    number += '-'
    offset++
  }

  while (offset < length) {
    var c1 = parser.buffer[offset++]
    if (c1 === 13 && parser.buffer[offset] === 10) { // \r\n
      parser.offset = offset + 1
      return number
    }
    number += c1 - 48
  }
}

/**
 * Returns a string or buffer of the provided offset start and
 * end ranges. Checks `optionReturnBuffers`.
 * @param parser
 * @param start
 * @param end
 * @returns {*}
 */
function convertBufferRange (parser, start, end) {
  // If returnBuffers is active, all return values are returned as buffers besides numbers and errors
  parser.offset = end + 2
  if (parser.optionReturnBuffers === true) {
    return parser.buffer.slice(start, end)
  }

  return parser.buffer.toString('utf-8', start, end)
}

/**
 * Parse a '+' redis simple string response but forward the offsets
 * onto convertBufferRange to generate a string.
 * @param parser
 * @returns {*}
 */
function parseSimpleStringViaOffset (parser) {
  var start = parser.offset
  var offset = parser.offset
  var length = parser.buffer.length
  var buffer = parser.buffer

  while (offset < length) {
    if (buffer[offset++] === 10) { // \r\n
      return convertBufferRange(parser, start, offset - 2)
    }
  }
}

/**
 * Returns the string length via parseSimpleNumbers
 * @param parser
 * @returns {*}
 */
function parseLength (parser) {
  var string = parseSimpleNumbers(parser)
  if (string !== undefined) {
    return +string
  }
}

/**
 * Parse a ':' redis integer response
 * @param parser
 * @returns {*}
 */
function parseInteger (parser) {
  // If stringNumbers is activated the parser always returns numbers as string
  // This is important for big numbers (number > Math.pow(2, 53)) as js numbers
  // are 64bit floating point numbers with reduced precision
  if (parser.optionStringNumbers) {
    return parseStringNumbers(parser)
  }
  return parseSimpleNumbers(parser)
}

/**
 * Parse a '$' redis bulk string response
 * @param parser
 * @returns {*}
 */
function parseBulkString (parser) {
  var length = parseLength(parser)
  if (length === undefined) {
    return
  }
  if (length === -1) {
    return null
  }
  var offsetEnd = parser.offset + length
  if (offsetEnd + 2 > parser.buffer.length) {
    parser.bigStrSize = offsetEnd + 2
    parser.bigOffset = parser.offset
    parser.totalChunkSize = parser.buffer.length
    parser.bufferCache.push(parser.buffer)
    return
  }

  return convertBufferRange(parser, parser.offset, offsetEnd)
}

/**
 * Parse a '-' redis error response
 * @param parser
 * @returns {Error}
 */
function parseError (parser) {
  var string = parseSimpleStringViaOffset(parser)
  if (string !== undefined) {
    if (parser.optionReturnBuffers === true) {
      string = string.toString()
    }
    return new ReplyError(string)
  }
}

/**
 * Parsing error handler, resets parser buffer
 * @param parser
 * @param error
 */
function handleError (parser, error) {
  parser.buffer = null
  parser.returnFatalError(error)
}

/**
 * Parse a '*' redis array response
 * @param parser
 * @returns {*}
 */
function parseArray (parser) {
  var length = parseLength(parser)
  if (length === undefined) {
    return
  }
  if (length === -1) {
    return null
  }

  var responses = new Array(length)
  var bufferLength = parser.buffer.length
  for (var i = 0; i < length; i++) {
    if (parser.offset >= bufferLength) {
      return
    }
    var response = parseType(parser, parser.buffer[parser.offset++])
    if (response === undefined) {
      return
    }
    responses[i] = response
  }

  return responses
}

/**
 * Called the appropriate parser for the specified type.
 * @param parser
 * @param type
 * @returns {*}
 */
function parseType (parser, type) {
  switch (type) {
    case 36: // $
      return parseBulkString(parser)
    case 58: // :
      return parseInteger(parser)
    case 43: // +
      return parseSimpleStringViaOffset(parser)
    case 42: // *
      return parseArray(parser)
    case 45: // -
      return parseError(parser)
    default:
      return handleError(parser, new ReplyError('Protocol error, got ' + JSON.stringify(String.fromCharCode(type)) + ' as reply type byte'))
  }
}

// All allowed options including their typeof value
var optionTypes = {
  returnError: 'function',
  returnFatalError: 'function',
  returnReply: 'function',
  returnBuffers: 'boolean',
  stringNumbers: 'boolean',
  name: 'string'
}

/**
 * Javascript Redis Parser
 * @param options
 * @constructor
 */
function JavascriptRedisParser (options) {
  if (!(this instanceof JavascriptRedisParser)) {
    return new JavascriptRedisParser(options)
  }
  if (!options || !options.returnError || !options.returnReply) {
    throw new TypeError('Please provide all return functions while initiating the parser')
  }
  for (var key in options) {
    if (typeof options[key] !== optionTypes[key]) {
      throw new TypeError('The options argument contains the property "' + key + '" that is either unkown or of a wrong type')
    }
  }
  if (options.name === 'hiredis') {
    /* istanbul ignore next: hiredis is only supported for legacy usage */
    try {
      var Hiredis = require('./hiredis')
      console.error(new TypeError('Using hiredis is discouraged. Please use the faster JS parser by removing the name option.').stack.replace('Error', 'Warning'))
      return new Hiredis(options)
    } catch (e) {
      console.error(new TypeError('Hiredis is not installed. Please remove the `name` option. The (faster) JS parser is used instead.').stack.replace('Error', 'Warning'))
    }
  }
  this.optionReturnBuffers = !!options.returnBuffers
  this.optionStringNumbers = !!options.stringNumbers
  this.returnError = options.returnError
  this.returnFatalError = options.returnFatalError || options.returnError
  this.returnReply = options.returnReply
  this.name = 'javascript'
  this.offset = 0
  this.buffer = null
  this.bigStrSize = 0
  this.bigOffset = 0
  this.totalChunkSize = 0
  this.bufferCache = []
}

/**
 * Concat a bulk string containing multiple chunks
 * @param parser
 * @param buffer
 * @returns {String}
 */
function concatBulkString (parser) {
  var list = parser.bufferCache
  // The first chunk might contain the whole bulk string including the \r
  var chunks = list.length
  var offset = parser.bigStrSize - parser.totalChunkSize
  parser.offset = offset
  if (offset === 1) {
    if (chunks === 2) {
      return list[0].toString('utf8', parser.bigOffset, list[0].length - 1)
    }
  } else {
    chunks++
  }
  var res = decoder.write(list[0].slice(parser.bigOffset))
  for (var i = 1; i < chunks - 2; i++) {
    // We are only safe to fully add up elements that are neither the first nor any of the last two elements
    res += decoder.write(list[i])
  }
  res += decoder.end(list[i].slice(0, offset === 1 ? list[i].length - 1 : offset - 2))
  return res
}

/**
 * Decrease the bufferPool size over time
 * @returns {undefined}
 */
function decreaseBufferPool () {
  if (bufferPool.length > 50 * 1024) {
    // Balance between increasing and decreasing the bufferPool
    if (counter === 1 || notDecreased > counter * 2) {
      // Decrease the bufferPool by 16kb by removing the first 16kb of the current pool
      bufferPool = bufferPool.slice(Math.floor(bufferPool.length / 10), bufferPool.length)
    } else {
      notDecreased++
      counter--
    }
  } else {
    clearInterval(interval)
    counter = 0
    notDecreased = 0
    interval = null
  }
}

/**
 * Concat the collected chunks from parser.bufferCache
 * @param parser
 * @param length
 * @returns {Buffer}
 */
function concatBuffer (parser, length) {
  var list = parser.bufferCache
  var pos = bufferOffset
  length -= parser.offset
  if (bufferPool.length < length + bufferOffset) {
    // Increase the bufferPool size by three times the current needed length
    var multiplier = 3
    if (bufferOffset > 1024 * 1024 * 200) {
      bufferOffset = 1024 * 1024 * 50
      multiplier = 2
    }
    bufferPool = new Buffer(length * multiplier + bufferOffset)
    bufferOffset = 0
    counter++
    pos = 0
    if (interval === null) {
      interval = setInterval(decreaseBufferPool, 50)
    }
  }
  list[0].copy(bufferPool, pos, parser.offset, list[0].length)
  pos += list[0].length - parser.offset
  for (var i = 1; i < list.length; i++) {
    list[i].copy(bufferPool, pos)
    pos += list[i].length
  }
  var buffer = bufferPool.slice(bufferOffset, length + bufferOffset)
  bufferOffset += length
  return buffer
}

/**
 * Parse the redis buffer
 * @param buffer
 * @returns {undefined}
 */
JavascriptRedisParser.prototype.execute = function (buffer) {
  if (this.buffer === null) {
    this.buffer = buffer
    this.offset = 0
  } else if (this.bigStrSize === 0) {
    var oldLength = this.buffer.length
    var remainingLength = oldLength - this.offset
    var newBuffer = new Buffer(remainingLength + buffer.length)
    this.buffer.copy(newBuffer, 0, this.offset, oldLength)
    buffer.copy(newBuffer, remainingLength, 0, buffer.length)
    this.buffer = newBuffer
    this.offset = 0
  } else if (this.totalChunkSize + buffer.length >= this.bigStrSize) {
    this.bufferCache.push(buffer)
    // The returned type might be Array * (42) and in that case we can't improve the parsing currently
    if (this.optionReturnBuffers === false && this.buffer[this.offset] === 36) {
      this.returnReply(concatBulkString(this))
      this.buffer = buffer
    } else { // This applies for arrays too
      this.buffer = concatBuffer(this, this.totalChunkSize + buffer.length)
      this.offset = 0
    }
    this.bigStrSize = 0
    this.totalChunkSize = 0
    this.bufferCache = []
  } else {
    this.bufferCache.push(buffer)
    this.totalChunkSize += buffer.length
    return
  }

  while (this.offset < this.buffer.length) {
    var offset = this.offset
    var type = this.buffer[this.offset++]
    var response = parseType(this, type)
    if (response === undefined) {
      this.offset = offset
      return
    }

    if (type === 45) {
      this.returnError(response) // Errors -
    } else {
      this.returnReply(response) // Strings + // Integers : // Bulk strings $ // Arrays *
    }
  }

  this.buffer = null
}

module.exports = JavascriptRedisParser
