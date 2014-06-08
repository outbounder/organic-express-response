var path = require("path")

var create404 = function(dna){
  var err = new Error()
  err.code = dna.defaultCode || 404
  err.response = dna.defaultResponse || "not found"
  err.template = dna.defaultTemplate
  return err
}

module.exports = function(plasma, dna) {
  plasma.on(dna.reactOn || "ExpressServer", function(c){
    var app = c.data || c[0].data;
    app.use(function(req, res, next){
      
      if(res.code)
        res.status(res.code)
      
      if(res.template)
        return res.render(res.template)
      
      if(res.response) {
        if(req.accepts("json") == "json")
          return res.json(res.response)
        else
          return res.send(res.response)
      }

      if(!dna.skipDefaultResponse)
        return next(create404(dna))
      else
        return next(dna.defaultNextRoute)
    })
    if(!dna.skipErrorResponses)
      app.use(function(err, req, res, next){
        if(err.code)
          res.status(err.code)
        
        if(err.template)
          return res.render(err.template)
        
        if(err.response) {
          if(req.accepts("json") == "json")
            return res.json(err.response)
          else
            return res.send(err.response)
        }

        if(!dna.skipDefaultErrorResponse) {
          res.status(dna.defaultErrorCode || 500)
          res.send(dna.defaultErrorResponse || "error found")
        } else
          next(err)
      })
  })
}