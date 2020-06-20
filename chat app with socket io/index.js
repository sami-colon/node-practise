const express = require('express');
const path = require('path');
const http = require('http');
const publicip = require('public-ip');
const iplocate = require('node-iplocate');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

let server = http.createServer(app).listen(3000, () => {
    console.log('listening on port 3000');
});

let io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {

    socket.on('nickname', (nickname) => {
    	socket.nickname = nickname;
    	socket.emit('userlist', Object.keys(io.sockets.sockets));
    });

    socket.on('message', (data) => {
        publicip.v4().then(ip => {
            iplocate(ip).then((res) => {
                const city = JSON.stringify(res.city, null, 2);
                const user = socket.nickname ? socket.nickname : 'anonymous';
                socket.emit('newmessage', { message: data.message, sender: user, city: city});
                socket.broadcast.emit('newmessage', { message: data.message, sender: user, city: city});
            });
        });
    });
});