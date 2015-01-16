module.exports = function(app) {

  // default not found handler
  app.use(function(req, res, next){
    res.status(404).send("not found")
  })

  // default error handler
  app.use(function(err, req, res, next) {
    console.error(err)
    res.status(500).send("server error")
  })
}