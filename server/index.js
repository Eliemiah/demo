const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 5000
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.set('Connection sucessfully established!')
});

server.listen(PORT, () => {
  console.log('listening on *:5000');
});



//Events

io.on('connection', (socket) => { 
    console.log('a user has connected!');

    socket.on('privateMessage', message => {
        console.log(socket.id, ' says: ', message.content)
        setTimeout(() => {
            io.to(socket.id).emit('privateMessage', {
                from:'marianasWeeb',
                content: 'Yes, my Thane?'})
        }, 3000)
    })
});
