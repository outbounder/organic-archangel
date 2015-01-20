var request = require("request")
var path = require("path")

module.exports = function(cell){
  this.cell = cell
  this.fetchResultsEndpoint = "http://"+cell.cellData.remote.split("@").pop()+":33333/api/stats"
}

module.exports.prototype.stats = function(done) {
  request.post({
    uri: this.fetchResultsEndpoint,
    json: {
      cwd: this.cell.cellData.cwd
    }
  }, function(err, res, body){
    if(err) return done(err)
    if(res.statusCode != 200) return done(new Error(res.statusCode+" statusCode "+body))
    done(null, body)
  })
}