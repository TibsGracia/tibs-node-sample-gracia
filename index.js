var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var nicknames = {}
var port = process.env.PORT||5000

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.username = "Anonymous";

  socket.on('username', function (msg) {
    socket.username = msg.username;
    if (!nicknames.hasOwnProperty(msg)) { //We check if data received is in nicknames array
      socket.username = msg.username;
      nicknames[socket.username] = { online: true }; //Then we put an object with a variable online
      console.log('user connected: ' + socket.username);
      console.log(nicknames)
      io.sockets.emit('username', nicknames);
    }
  })

  socket.on('online', function (msg) {
    io.sockets.emit('online', { username: socket.username, message: " join the group chat" })
  })

  socket.on('disconnect', function (msg) {
    io.sockets.emit('online', { username: socket.username, message: " left the group chat" })
    console.log()
    console.log('user disconnected:' + socket.username)
    if (!socket.username) return;
    nicknames[socket.username].online = false;
    console.log(nicknames)
    io.sockets.emit('username', nicknames);
  })

  socket.on('chat message', function (msg) {
    console.log('message')
    io.sockets.emit('chat message', { message: msg.message, username: socket.username });
  });
  socket.on('typing', function () {
    socket.broadcast.emit('typing', { username: socket.username })
  })

});

app.use(express.static('public'));

http.listen(port, function () {
  console.log('listening on *:' + port);
});
