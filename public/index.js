var $ = function(id) {
    return document.getElementById(id);
};

var loginBlock = $('login-block');
var loginButton = $('login-button');
var usernameField = $('username-field');
var passwordField = $('password-field');

var chatBlock = $('chat-block');
var textArea = $('text-area');
var sendButton = $('send-button');
var messageField = $('message-field');

loginBlock.style.display = "block";
chatBlock.style.display = "none";

var port = 3000;
var socket = io.connect('http://localhost:' + port);

loginButton.onclick = function() {
    var username = usernameField.value;
    var password = passwordField.value;

    if (username.length > 0 && password.length > 0) {
        socket.emit('authorize', username, password);
    }
};

socket.on('authorize', function(success) {
    if (success) {
        loginBlock.style.display = "none";
        chatBlock.style.display = "block";
    }
});

sendButton.onclick = function() {
    socket.emit('send-message', messageField.value);
    messageField.value = null;
};

socket.on('new-user', function(name) {
    textArea.value +=  name + ' connected\n';
});

socket.on('recv-message', function(name, message) {
    textArea.value += name + ' : ' + message + '\n';
});
