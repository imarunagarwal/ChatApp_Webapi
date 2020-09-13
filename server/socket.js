module.exports = function (server) {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('join', function (data) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'Has joined this room' });
        });

        socket.on('leave', function (data) {
            socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'Has left this room' });
            socket.leave(data.room);
        });

        socket.on('message', function (data) {
            io.in(data.room).emit('new message', { user: data.user, message: data.message });
        })
    });
}