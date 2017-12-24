var logger = require('log4js').getLogger();
logger.level = 'debug';

var mongo = require('mongodb').MongoClient;
var users = null;
var messages = null;

mongo.connect('mongodb://127.0.0.1:27017', function(error, database) {
    if (error) {
        logger.error(error);
    } else {
        logger.debug('Connected to MongoDB');

        var chatdb = database.db('chatdb');
        users = chatdb.collection('users');
        messages = chatdb.collection('messages');
    }
});

function userExists(username, callback) {
    users.find({username: username}).toArray(function(error, list) {
        if (error) {
            logger.error(error);
        } else {
            callback(list.length > 0);
        }
    });
}

function loginUser(username, password, callback) {
    userExists(username, function(exists) {
        if (exists) {
            users.find({username: username}).toArray(function(error, list) {
                if (error) {
                    logger.error(error);
                    callback(false);
                } else {
                    callback(list.pop().password === password);
                }
            });
        } else {
            users.insert({username: username, password: password}, function(error) {
                if (error) {
                    logger.error(error);
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
}

var express = require('express');
var http = require('http');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    logger.debug(socket.id + ' connected');

    socket.on('authorize', function(name, password) {
        loginUser(name, password, function(success) {
            socket.emit('authorize', success);

            if (success) {
                logger.debug(name + ' logged in with password ' + password);

                socket.emit('authorize', true);
                socket.broadcast.emit('user-join', name);

                socket.on('send-message', function(message) {
                    socket.broadcast.emit('recv-message', name, message);

                    logger.debug(name + ': ' + message);

                    mesages.insert({message: message, from: name}, function(error) {
                        if (error) {
                            logger.error(error);
                        }
                    });
                });

                socket.on('disconnect', function() {
                    io.sockets.emit('user-left', name);

                    logger.debug(name + ' disconnected');
                });
            } else {
                logger.debug(name + ' failed to log in with password ' + password);
            }
        });
    });
});

var port = 3000;
server.listen(port, function() {
    logger.debug('Chat server started');
});
