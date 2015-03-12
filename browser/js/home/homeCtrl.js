'use strict';
var socket = io.connect();

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('MainCtrl', function($scope) {
  $scope.notes = [];

  // Incoming
  socket.on('onNoteCreated', function(data) {
    $scope.$apply( function () {
      $scope.notes.push(data);
    });
  });

  socket.on('onNoteDeleted', function(data) {
    $scope.$apply( function () {
      $scope.handleDeletedNoted(data.id);
    });
  });

  // Outgoing
  $scope.createNote = function() {
    console.log("createNote called");
    var note = {
      id: new Date().getTime(),
      title: 'New Note',
      body: 'Pending'
    };

    $scope.notes.push(note);
    socket.emit('createNote', note);
  };

  $scope.deleteNote = function(id) {
    $scope.handleDeletedNoted(id);

    socket.emit('deleteNote', {id: id});
  };

  $scope.handleDeletedNoted = function(id) {
    var oldNotes = $scope.notes,
    newNotes = [];

    angular.forEach(oldNotes, function(note) {
      if(note.id !== id) newNotes.push(note);
    });

    $scope.notes = newNotes;
  }
});


