var os = require("os")

module.exports = function(){
  return {
    "POST": function(req, res, next) {
      res.body = {
        os: {
          cpus: os.cpus(),
          memory: {
            free: os.freemem(),
            total: os.totalmem()
          },
          loadavg: os.loadavg(),
          uptime: os.uptime()
        }
      }
      next()
    }
  }
}