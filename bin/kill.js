var fs = require("fs")
var path = require("path")

var cwd = path.normalize(path.join(__dirname, "/../"))
var target = path.join(cwd, "server.js")
var pidFile = path.join(cwd, target+".pid")

if(fs.existsSync(pidFile))
  process.kill(parseInt(fs.readFileSync(pidFile).toString())