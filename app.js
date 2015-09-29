var express = require('express');
var app = express();
var choices = require('./choices.json');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var votes = null;
var start = function (i, socket) {
  votes =  choices[i];
  votes.left.total = 0;
  votes.right.total = 0;
};

start(0);

io.on('connection', function(socket){
  // send all data
  socket.emit('votes', votes);

  socket.on('choice', function(what){
    console.log(what);
    if (what === 'left') {
      votes.left.total++;
    } else {
      votes.right.total++;
    }
    io.sockets.emit('total', votes);
  });

  socket.on('unchoice', function(what){
    console.log('what');
    if (what === 'left') {
      votes.left.total--;
    } else {
      votes.right.total--;
    }
    io.sockets.emit('total', votes);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
