# organic-express-response

Organelle for adding default response to incoming requests as expressjs middleware.

## usage with organic-express-routes

    module.exports = function(){
      return {
        "GET": function(req, res, next) {
          res.template = "landing"
          next()
        },
        "POST": function(req, res, next) {
          res.body = {success: true}
          next()
        },
        "PUT": function(req, res, next) {
          var not_implemented_error = new Error()
          not_implemented_error.code = 400
          not_implemented_error.body = "not implemented"
          next(not_implemented_error)
        }
      }
    }

## usage with plain express

    // given the express app
    var app = express()

    // construct express response middleware instance
    var plasma = new (require("organic-plasma"))()
    require("organic-express-response")(plasma, {reactOn: "ExpressServer"})

    // and attach it to express app
    plasma.emit({type: "ExpressServer", data: app})

    // respond with template
    app.get("/", function(req, res, next){
      res.template = "landing"
      next()
    })

    // respond with raw json data
    app.post("/data", function(req, res, next){
      res.body = {success: true}
      next()
    })

    // respond with custom error
    app.get("/failing/route", function(req, res, next){
      var errorFound = new Error()
      errorFound.code = 400
      errorFound.body = "missing argument"
      next(errorFound)
    })

The middleware 

 * intercepts all requests and sends them as response in case they define `response properties` 
   * or responds with defaults if configured to do so
   * or pass the control flow to followup middleware functions if configured to do so

Optionally the middleware 

  * intercepts errors/exceptions from the request - response chain and sends them as response in case they define `response error properties` 
    * or pass the control flow to followup error middleware functions.

## response properties

### `res.template`

Does `res.render(res.template)`

### `res.body`
#### alias `res.response`

Sends `res.body` data either to `json` or `send` express res methods.

### `res.code`

Sets `res.status`

## response error properties

### `err.template`

Does `res.render(err.template)`

### `err.body`
#### alias `err.response`

Sends `err.body` data either to `json` or `send` express res methods.

### `err.code`

Sets `res.status`

## dna

    {
      "source": "node_modules/organic-express-response",
      "reactOn": "ExpressServer",


      "skipErrorResponses": false,

      "defaultNextRoute": undefined,
      "skipDefaultResponse": true,
      "defaultCode": 404,
      "defaultTemplate": undefined,
      "defaultBody": "not found",

      "skipDefaultErrorResponse": true
      "defaultErrorCode": 500,
      "defaultErrorBody": "error found",
      
    }

### `reactOn` property

Should be either `ExpressServer` chemical with [expected structure](https://github.com/outbounder/organic-express-server#emitready-chemical) or array of chemicals where the first one is mapped as `ExpressServer` chemical.

### `defaultCode`, `defaultTemplate`, `defaultBody` properties

All specify what is the default response if `response properties` where not found. If `defaultTemplate` is provided then it will be used instead of `defaultBody`.

### `skipDefaultResponse`, `defaultNextRoute` properties

Optional, if set to `true` default response will not be triggered and the middleware will call `next(defaultNextRoute)` instead.

### `skipDefaultErrorResponse` 

Optional, if set to `true` will not send default error response

### `defaultErrorCode`, `defaultErrorBody` properties

All specify what is the default error response code and data when error has been found but it is missing `error response properties`

### `skipErrorResponses` property

Optional, if set to `true` will not mount error middleware handler to express app leaving only the middleware for responses without error.