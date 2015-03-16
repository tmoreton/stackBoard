'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log("socket is here!");
        // Now have access to socket, wowzers!
        socket.on('createItem', function(data) {
            console.log("socket hears createItem was called");
            socket.broadcast.emit('onItemCreated', data);
        });

        socket.on('updateItem', function(data) {
            console.log("updating Item");
            socket.broadcast.emit('onItemUpdated', data);
        });

        socket.on('deleteItem', function(data){
            console.log("updating Item");
            socket.broadcast.emit('onItemDeleted', data);
        });

        socket.on('moveItem', function(data){
            console.log("Item moving");
            socket.broadcast.emit('onItemMoved', data);
        });

        //track drawing movement
        socket.on('mousemove', function(data) {
            console.log("mousemove");
            socket.broadcast.emit('moving', data);
        });
    });

};
