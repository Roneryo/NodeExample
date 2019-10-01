// var PORT = process.env.PORT || 5000;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


nicknames = [];
app.get('/', function(req, res){
    res.sendFile('index.html', { root: './'});
});


io.on('connection',function(socket){

//new user 
    socket.on('new user', function(data, callback){

        if (nicknames.indexOf(data) != -1){
            callback(false);
        } else{
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
                console.log('user connected: ' + socket.nickname);
        //  io.emit('update_personal', nicknames + ': Online');

            updateNicknames();
        }
    });

// update all user name

    function updateNicknames(){
        io.sockets.emit('usernames', nicknames);

    }

// send message 

    socket.on('send message', function(data){
    console.log('message: ' + {msg: data, nick: socket.nickname});
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

//disconnected service

    socket.on('disconnect', function(data){
        console.log('user disconnected:' + socket.nickname )
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });

});

http.listen(8080, function(){
  console.log('listening on *:'+8080);
});