var request = require("request")
var path = require("path")
var Action = require("./tunnel-action")

module.exports = function(cell){
  this.cell = cell
  this.fetchResultsEndpoint = "http://"+cell.cellData.remote.split("@").pop()+":33333"
}

module.exports.prototype.run = function(cmd) {
  var cmdData = {}
  cmdData.remote = this.cell.cellData.remote
  cmdData.cwd = path.join(this.cell.cellData.cwd, ".archangel")
  cmdData.sourceNode = this.cell.cellData.sourceNode
  var action = new Action()
  action.start(cmd, cmdData)
  return action
}

module.exports.prototype.fetchResults = function(done) {
  request.post({
    uri: this.fetchResultsEndpoint,
    json: {
      cwd: this.cell.cellData.cwd
    }
  }, function(err, res, body){
    if(err) return done(err)
    if(res.statusCode != 200) return done(new Error(res.statusCode+" statusCode != 200 "))
    done(null, body)
  })
}