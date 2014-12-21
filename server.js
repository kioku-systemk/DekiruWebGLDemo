/*jslint devel: true, browser: true*/
/*global require, process*/
//
//  Simple node.js web server
//
var http = require('http'),
    fs = require('fs'),
    port = 8080;
var server = http.createServer(function (req, res) {
    'use strict';
    console.log('REQ>', req.url);
    var file, fname;
    if (req.url === '/') {
        file = fs.readFileSync('index.html');
        res.end(file);
    } else {
        try {
            fname = req.url.substr(1, req.url.length); // remove '/'
            file = fs.readFileSync(fname);
            res.end(file);
        } catch (e) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('not found\n');
        }
    }
});
if (process.argv.length > 2) {
    port = process.argv[2];
}
server.listen(port);
console.log('start server "http://localhost:' + port + '/"');
