var Angel = require("organic-angel")
var cellcmds = require("angelscripts-cellcmds")
var request = require("request")

module.exports = function(cell){
  this.cell = cell
  this.fetchResultsEndpoint = "http://"+cell.cellData.remote.split("@").pop()+":33333"
}

module.exports.prototype.probe = function(done) {
  var self = this
  this.probeExists(cell, function(err, exists){
    if(err) return done(err)
    if(exists)
      self.fetchResults(cell, done)
    else
      self.installProbe(cell, function(err){
        if(err) return done(err)
        self.fetchResults(cell, done)
      })
  })
}

module.exports.prototype.runAngel = function(cmd, done) {
  var angel = new Angel()
  
  angel.cmdData.remote = this.cell.cellData.remote
  angel.cmdData.cwd = path.join(this.cell.cellData.cwd, ".archangel")

  cellcmds(angel)
  angel.do(cmd+" "+path.join(__dirname, "archangel.cell.json"), function(err){
    if(err) return done(err)
    console.log(arguments)
    done(null, false)
  })
}

module.exports.prototype.probeExists = function(done) {
  this.runAngel("cell exists", done)
}

module.exports.prototype.installProbe = function(done) {
  this.runAngel("cell install", done)
}

module.exports.prototype.fetchResults = function(done) {
  request.post({
    uri: this.fetchResultsEndpoint,
    json: {
      cwd: this.cell.cwd
    }
  }, function(err, res, body){
    if(err) return done(err)
    if(res.statusCode != 200) return done(new Error(res.statusCode+" statusCode != 200 "))
    done(null, body)
  })
}