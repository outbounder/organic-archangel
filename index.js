if(!module.parent) {
  process.env.CELL_MODE="_development"
  var Cell = require("./server")
  var cell = new Cell()
  cell.start(function(err){
    if(err) throw err
  })
} else
  module.exports = require("./lib/tunnel")