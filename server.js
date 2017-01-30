/*eslint-disable*/
//const http = require('http');

const express = require('express');

const server = express();
server.use(express.static(__dirname ));

//const server = http.createServer(function(req, res) {
  //res.writeHead(200);
  //res.write('<p>Hello World</p>');
  //res.end();
//});

const port = 10001;

server.listen(port, function() {
  console.log('server listening on port' + port);
});
/*eslint-enable*/
