var should = require('should');
var io = require('socket.io-client');

var serverURL = 'http://localhost:3000';

var user1 = {
    name: 'Bob',
    password: '123',
};
var user2 = {
    name: 'Lisa',
    password: 'qwerty',
    message: 'Hello, Bob!',
};

describe('Chat Server', function() {
    this.timeout(5000);

    it('Should successfully authorize new user', function(done) {
        var client = io.connect(serverURL);

        client.on('connect', function() {
            client.emit('authorize', user1.name, user1.password);
        });

        client.on('authorize', function(username, success) {
            client.disconnect();

            if (success) {
                done();
            }
        });
    });

    it('Should fail to authorize new user', function(done) {
        var client1 = io.connect(serverURL);

        client1.on('connect', function() {
            client1.emit('authorize', user1.name, user1.password);
        });

        client1.on('authorize', function(username, success) {
            client1.disconnect();

            var client2 = io.connect(serverURL);

            client2.on('connect', function() {
                client2.emit('authorize', user1.name, user1.password + '1234');
            });

            client2.on('authorize', function(username, success) {
                client2.disconnect();

                if (!success) {
                    done();
                }
            });
        });
    });

    it('Should broadcast user connection to already connected user', function(done) {
        var client1 = io.connect(serverURL);

        client1.on('connect', function() {
            client1.emit('authorize', user1.name, user1.password);
        });

        client1.on('authorize', function(username, success) {
            var client2 = io.connect(serverURL);

            client2.on('connect', function() {
                client2.emit('authorize', user2.name, user2.password);
            });

            client2.on('authorize', function(username, success) {
                client2.disconnect();
            });
        });

        client1.on('user-join', function(username) {
            client1.disconnect();

            username.should.equal(user2.name);
            done();
        });
    });

    it('Should broadcast user disconnection to already connected user', function(done) {
        var client1 = io.connect(serverURL);

        client1.on('connect', function() {
            client1.emit('authorize', user1.name, user1.password);
        });

        client1.on('authorize', function(username, success) {
            var client2 = io.connect(serverURL);

            client2.on('connect', function() {
                client2.emit('authorize', user2.name, user2.password);
            });

            client2.on('authorize', function(username, success) {
                client2.disconnect();
            });
        });

        client1.on('user-left', function(username) {
            client1.disconnect();

            username.should.equal(user2.name);
            done();
        });
    });

    it('Should broadcast user message to already connected user', function(done) {
        var client1 = io.connect(serverURL);

        client1.on('connect', function() {
            client1.emit('authorize', user1.name, user1.password);
        });

        client1.on('authorize', function(username, success) {
            var client2 = io.connect(serverURL);

            client2.on('connect', function() {
                client2.emit('authorize', user2.name, user2.password);
            });

            client2.on('authorize', function(username, success) {
                client2.emit('send-message', user2.message);
                client2.disconnect();
            });
        });

        client1.on('recv-message', function(username, message) {
            client1.disconnect();

            username.should.equal(user2.name);
            message.should.equal(user2.message);

            done();
        });
    });
});
