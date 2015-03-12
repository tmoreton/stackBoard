'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('MainCtrl', function($scope, socketFactory){
  $scope.notes = [];

  //Incoming
  socket.on('onNoteCreated', function(note){
    $scope.notes.push(note);
  });

  socket.on('onNoteDeleted', function(note){
    $scope.handleDeletedNote(note.id);
  });

  //Outgoing
  $scope.createNote = function() {
    var note = {
      id: new Date().getTime(),
      title: "",
      body: ""
    };

    $scope.notes.push(note);
    socketFactory.emit('createNote', note);
  };

  $scope.deleteNote = function(id){
    $scope.handleDeletedNote(id);
    socketFactory.emit('deleteNote', {id:id})
  };

  $scope.handleDeletedNote = function(id){
    var oldNotes = $scope.notes;
    newNotes = [];

    oldNotes.forEach(function(note){
      if(note.id !== id) newNotes.push(note);
    });

    $scope.notes = newNotes;
  }
})
