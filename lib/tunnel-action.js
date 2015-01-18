var format = require("string-template")
var uuid = require("node-uuid")
var util = require("util")
var EventEmitter = require("events").EventEmitter
var exec = require("child_process").exec

var commands = {
  "install": "mkdir -p {cwd} && cd {cwd} && {sourceNode} && npm install outbounder/organic-archangel && node ./node_modules/organic-archangel/bin/spawn.js",
  "uninstall": "cd {cwd} && {sourceNode} && node ./node_modules/organic-archangel/bin/kill.js && rm -rf ./node_modules/organic-archangel"
}

var Action = function(){
  this.id = uuid.v1()
  this.returnCode = null
  this.output = ""
  this.cmd = null
  this.cmdData = null
  this.running = false
  this.startedDate = null
  this.stoppedDate = null

  this.child = null
}

util.inherits(Action, EventEmitter)

Action.prototype.toJSON = function(){
  return {
    id: this.id,
    output: this.output,
    returnCode: this.returnCode,
    running: this.running,
    startedDate: this.startedDate,
    stoppedDate: this.stoppedDate,
    cmd: this.cmd,
    cmdData: this.cmdData
  }
}

Action.prototype.start = function(cmd, cmdData) {
  var self = this

  this.cmd = cmd
  this.cmdData = cmdData
  this.running = true
  this.startedDate = new Date()

  this.child = exec(cmdData.remote+" '"+format(commands[cmd]+"'", cmdData))
  this.child.stdout.on("data", function(chunk){
    self.output += chunk.toString()
    self.emit("stdout", chunk.toString())
  })
  this.child.stderr.on("data", function(chunk){
    self.output += chunk.toString()
    self.emit("stderr", chunk.toString())
  })
  this.child.on("exit", function(code){
    self.returnCode = code
    self.running = false
    self.stoppedDate = new Date()
    if(code == 0)
      self.emit("stop")
    else
      self.emit("stop")
  })
}

Action.prototype.stop = function(done) {
  this.child.kill()
  done()
}

module.exports = Action