'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log("socket is here!");
        // Now have access to socket, wowzers!
        socket.on('createNote', function(data) {
            console.log("socket hears createNote was called");
            socket.broadcast.emit('onNoteCreated', data);
        });

        socket.on('updateNote', function(data) {
            console.log("updating note");
            socket.broadcast.emit('onNoteUpdated', data);
        });

        socket.on('deleteNote', function(data){
            socket.broadcast.emit('onNoteDeleted', data);
        });

        socket.on('moveNote', function(data){
            socket.broadcast.emit('onNoteMoved', data);
        });

        //track drawing movement
        socket.on('mousemove', function(data) {
            console.log("mousemove");
            socket.broadcast.emit('moving', data);
        });
    });

};
