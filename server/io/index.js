'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        socket.on('createNote', function(data) {
            socket.broadcast.emit('onNoteCreated', data);
        });

        socket.on('updateNote', function(data) {
            socket.broadcast.emit('onNoteUpdated', data);
        });

        socket.on('deleteNote', function(data){
            socket.broadcast.emit('onNoteDeleted', data);
        });

        socket.on('moveNote', function(data){
            socket.broadcast.emit('onNoteMoved', data);
        });
    });

};
