/*
*Simple Node.js hello word RESTful Api using cluster module
*
*/

//load dependencies
const http = require('http');
const url = require('url');
const Decoder = require("string_decoder").StringDecoder;

//define server object to hold functions
const server = {};

//create http server
server.httpServer = http.createServer(function (req, res) {

  //get url entered and parse it
  const parsedUrl = url.parse(req.url, true);

  //get url pathname
  const urlPathName = parsedUrl.pathname;

  //get url path name and trim it of end slashes
  const trimmedPathName = urlPathName.replace(/^\/+|\/+$/g, '');

  //get query and assign it to a variable
  const stringQuery = parsedUrl.query;

  //get user's requested method
  const method = req.method.toLowerCase();

  //get headers
  const header = req.headers;

  //initalize payload from user's request and set to an empty string
  let stringLoad = '';


  //initialize string decoder
  const decoder = new Decoder("utf-8");

  //on request, write in data to payload
  req.on('data', function (data) {
    stringLoad += decoder.write(data);
  })

  req.on('end', function () {
    stringLoad += decoder.end();

    //get router selected and associated data
    const selectedRouter = typeof server.routers[trimmedPathName] !== undefined ? server.routers[trimmedPathName] : path.NotFound;

    data = {
      'trimmedPathName': trimmedPathName,
      'stringQuery': stringQuery,
      'methods': method,
      'payLoad': stringLoad,
      'headers': header
    }

    //get status code and convert payload to JSON string then write it to response
    selectedRouter(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};

      //convert payload to JSON format
      const loadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(loadString);
      console.log(trimmedPathName, stringQuery, method, statusCode);
    })
  })

})


//Define function to initialize server and set it to listen on port 3030
server.init = function () {
  server.httpServer.listen(3030, function () {
    console.log("Server started and listening on port 3030");
  });
}



//define paths
const paths = {};

//define response for /hello path
paths.hello = function (data, callback) {
  callback(200, { "Hi there": "Congrats on hitting this point. This is where we get to say hello to each other!" });
};

//define response for path no found
paths.NotFound = function (data, callback) {
  callback(404);
};

//define router
server.routers = {
  'hello': paths.hello,
}

//export server file
module.exports = server;