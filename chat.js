var express = require('express');
var http = require('http');
var socket = require('socket.io');

var logger = require('log4js').getLogger();
logger.level = 'debug';

var app = express();
var server = http.Server(app);
var io = socket(server);

var port = process.env.PORT || 3000;
server.listen(port, function() {
    logger.debug('Chat server has started');
});
