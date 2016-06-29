var Readable = require('readable-stream')
var diff = require('adiff').diff

module.exports = function (textarea) {
  textarea.addEventListener('input', onInput)

  var old = []
  var stream = new Readable({objectMode: true})

  stream._read = function () {}

  function onInput (ev) {
    var val = textarea.value.split('')
    var d = diff(old, val)
    if (d[0]) {
      var pos = d[0][0]
      if (!d[0][1]) {
        // insert
        var str = d[0].slice(2).join('')
        stream.push({ op: 'insert', pos: pos, str: str })
      } else {
        // delete
        stream.push({ op: 'delete', pos: pos, count: d[0][1] })
      }
    }
    old = val
  }

  return stream
}
