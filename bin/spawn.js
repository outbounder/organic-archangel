var exec = require("child_process").exec
var fs = require("fs")
var path = require("path")

var cwd = path.normalize(path.join(__dirname, "/../"))
var target = path.join(cwd, "server.js")
var pidFile = path.join(cwd, target+".pid")

if(fs.existsSync(pidFile))
  require("./kill")

var out = fs.openSync(target+".out", 'a')
var err = fs.openSync(target+".err", 'a')
var stdio = ['ignore', out, err]

var options = {
  detached: true,
  cwd: cwd,
  env: process.env,
  silent: true,
  stdio: stdio
}

var childCell = child_process.spawn(process.argv[0], target, options);
childCell.unref();


fs.writeFile(pidFile, childCell.pid, function(err){
  if(err) {
    process.stderr.write(err.stack.toString())
    return process.exit(1)
  }
  process.exit(0)
})