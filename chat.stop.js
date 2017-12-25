var io = require('socket.io-client');
var client = io.connect('http://localhost:3000');

client.on('connect', function() {
    client.emit('npm-stop', 'U,-q7&`+C2?!"mBf');
    setTimeout(function() {
        process.exit(0);
    }, 1000);
});
