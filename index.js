/*
*Index file for Node JS Application using cluster module
*
*/

//Load dependencies
const cluster = require('cluster');
const numCPU = require('os').cpus().length;
const server = require('./server');

//Declare the app
const app = {}

//Initialize function
app.init = function() {
  //check for master thread
  if(cluster.isMaster) {
   
    //Fork workers
    for(let i = 0; i < numCPU; i++) {
      cluster.fork()
    }
    return;
    //start the server on threads other than master
  } else {
    server.init()
  }
  //log to the console
  console.log(`Worker ${process.pid} started`);
}

//Declare the function to be self initializing
app.init()


//export the app
module.exports = app;