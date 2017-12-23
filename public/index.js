var $ = function(id) {
    return document.getElementById(id);
};

var port = 3000;
var socket = io.connect('http://localhost:' + port);

var textArea = $('text-area');
var sendButton = $('send-button');
var messageField = $('message-field');

sendButton.onclick = function() {
    socket.emit('send-message', messageField.value);
    messageField.value = null;
};

socket.on('user-name', function(name) {
    textArea.value += 'Your name is ' + name + '\n';
});

socket.on('new-user', function(name) {
    textArea.value +=  name + ' connected\n';
});

socket.on('recv-message', function(name, message) {
    textArea.value += name + ' : ' + message + '\n';
});
