var express = require('express');
var http = require('http');
var socket = require('socket.io');

var logger = require('log4js').getLogger();
logger.level = 'debug';

var app = express();
var server = http.Server(app);
var io = socket(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    var name = (socket.id).toString();

    socket.broadcast.emit('new-user', name);
    socket.emit('user-name', name);

    logger.debug(name + ' connected');

    socket.on('send-message', function(message) {
        io.sockets.emit('recv-message', name, message);

        logger.debug(name + ' : ' + message);
    });

    socket.on('disconnect', function() {
        logger.debug(name + ' disconnected');
    });
});

var port = 3000;
server.listen(port, function() {
    logger.debug('Chat server started');
});
