var path = require("path")

var create404 = function(dna){
  var err = new Error()
  err.code = dna.defaultCode || 404
  err.body = dna.defaultBody || "not found"
  err.template = dna.defaultTemplate
  return err
}

module.exports = function(plasma, dna) {
  dna.skipDefaultErrorResponse = dna.skipDefaultErrorResponse || true
  dna.skipDefaultResponse = dna.skipDefaultResponse || true

  plasma.on(dna.reactOn || "ExpressServer", function(c){
    var app = c.data || c[0].data;
    app.use(function(req, res, next){

      if(typeof res.code == "number")
        res.status(res.code)

      if(res.template)
        return res.render(res.template)

      if(typeof res.response != "undefined" || typeof res.body != "undefined") {
        if(req.accepts("json") == "json")
          return res.json(res.response || res.body)
        else
          return res.send(res.response || res.body)
      }

      if(!dna.skipDefaultResponse)
        return next(create404(dna))
      else
        return next(dna.defaultNextRoute)
    })
    if(!dna.skipErrorResponses)
      app.use(function(err, req, res, next){
        if(typeof err.code == "number")
          res.status(err.code)

        if(err.template)
          return res.render(err.template)

        if(typeof err.response != "undefined" || typeof err.body != "undefined") {
          if(req.accepts("json") == "json")
            return res.json(err.response || err.body)
          else
            return res.send(err.response || err.body)
        }

        if(!dna.skipDefaultErrorResponse) {
          res.status(dna.defaultErrorCode || 500)
          res.send(dna.defaultErrorBody || "error found")
        } else
          next(err)
      })
  })
}