var fs = require("fs")
var path = require("path")

module.exports = function(done){
  var cwd = path.normalize(path.join(__dirname, "/../"))
  var target = path.join(cwd, "server.js")
  var pidFile = target+".pid"

  fs.exists(pidFile, function(found){

    if(found) {
      var pid = parseInt(fs.readFileSync(pidFile).toString())
      try {
        process.kill(pid)
      } catch(err){
        console.error(err)
      }
      fs.unlinkSync(pidFile)
    }

    done && done()
  })  
}

if(!module.parent)
  module.exports()