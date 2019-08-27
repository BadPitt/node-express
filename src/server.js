const cluster = require('cluster');
const express = require('./express');
const numCPUs = require('os').cpus().length;

let isCluster = false;
if (isCluster) {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    express();

    console.log(`Worker ${process.pid} started`);
  }
} else {
  express();
}
