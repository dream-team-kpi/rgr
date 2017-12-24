var $ = function(id) {
    return document.getElementById(id);
};

var loginBlock = $('login-block');
var loginButton = $('login-button');
var usernameField = $('username-field');
var passwordField = $('password-field');

var chatBlock = $('chat-block');
var messageList = $('message-list');
var sendButton = $('send-button');
var messageField = $('message-field');

loginBlock.style.display = "block";
chatBlock.style.display = "none";

function appendMessage(message) {
    if (message.length > 0) {
        var listItem = document.createElement('li');
        var listItemText = document.createTextNode(message);
        listItem.appendChild(listItemText);
        messageList.appendChild(listItem);
    }
}

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
        messageField.focus();
    }
});

function sendMessage() {
    var message = messageField.value;
    if (message.length > 0) {
        appendMessage('Me: ' + message);
        socket.emit('send-message', message);

        messageField.value = null;
        messageField.focus();
    }
}

messageField.onkeydown = function(event) {
    if (event.which == 13) {
        sendMessage();
    }
};

sendButton.onclick = function() {
    sendMessage();
};

socket.on('user-join', function(name) {
    appendMessage('User ' + name + ' has joined chat!');
});

socket.on('user-left', function(name) {
    appendMessage('User ' + name + ' has left chat!');
});

socket.on('recv-message', function(name, message) {
    appendMessage(name + ': ' + message);
});
