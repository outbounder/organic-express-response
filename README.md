# organic-express-response

Organelle for adding default response to incoming requests as expressjs middleware.

## live usage

    var app = express()

    var plasma = new (require("organic-plasma"))()
    require("organic-express-response")(plasma, {reactOn: "ExpressServer"})
    plasma.emit({type: "ExpressServer", data: app})

    app.get("/", function(req, res, next){
      res.template = "landing"
      next()
    })
    app.post("/data", function(req, res, next){
      res.response = {success: true}
      next()
    })
    app.get("/failing/route", function(req, res, next){
      var errorFound = new Error()
      errorFound.code = 400
      errorFound.response = "missing argument"
      next(errorFound)
    })
    app.put("/update", function(req, res, next){
      if(!req.body) return next(missingBodyError)
      some_store.update(req.body, function(err, data){
        if(err) return next(err)
        res.response = data
        next()
      })
    })

The middleware 

 * intercepts all requests and sends them as response in case they define `response properties` 
   * or responds with defaults if configured to do so
   * or pass the control flow to followup middleware functions if configured to do so

Optionally the middleware 

  * intercepts errors from the request - response chain and sends them as response in case they define `response error properties` 
    * or pass the control flow to followup error middleware functions.

## response properties

### `res.template`

Does `res.render(res.template)`

### `res.response`

Sends `res.response` data either to `json` or `send` express res methods.

### `res.code`

Sets `res.status`

## response error properties

### `err.template`

Does `res.render(err.template)`

### `err.response`

Sends `err.response` data either to `json` or `send` express res methods.

### `err.code`

Sets `res.status`

## dna

    {
      "source": "node_modules/organic-express-response",
      "reactOn": "ExpressServer",
      "defaultCode": 404,
      "defaultTemplate": undefined,
      "defaultResponse": "not found",
      "skipDefaultResponse": false,
      "defaultNextRoute": undefined,
      "skipErrorResponses": false,
      "defaultErrorCode": 500,
      "defaultErrorResponse": "error found",
      "skipDefaultErrorResponse": false
    }

### `reactOn` property

Should be either `ExpressServer` chemical with [expected structure](https://github.com/outbounder/organic-express-server#emitready-chemical) or array of chemicals where the first one is mapped as `ExpressServer` chemical.

### `defaultCode`, `defaultTemplate`, `defaultResponse` properties

All specify what is the default response if `response properties` where not found. If `defaultTemplate` is provided then it will be used instead of `defaultResponse`.

### `skipDefaultResponse`, `defaultNextRoute` properties

Optional, if set to `true` default response will not be triggered and the middleware will call `next(defaultNextRoute)` instead.

### `skipDefaultErrorResponse` 

Optional, if set to `true` will not send default error response

### `defaultErrorCode`, `defaultErrorResponse` properties

All specify what is the default error response code and data when error has been found but it is missing `error response properties`

### `skipErrorResponses` property

Optional, if set to `true` will not mount error middleware handler to express app leaving only the middleware for responses without error.