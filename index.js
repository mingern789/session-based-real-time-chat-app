const express = require('express');

const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

var onlineUsers = 0;
var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('update online count', onlineUsers);
  console.log('Online users: ' + onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('update online count', onlineUsers);
    let newUsers = users.filter(x =>
      x.id != socket.id
    );
    users = newUsers;
    io.emit('online user', users);
    io.emit('update online list', socket.id);
  });

  socket.on('online user', (user) => {
    users.push({ name: user, id: socket.id })
    io.emit('online user', users);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('server started');
});
