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

  //moved this from the UpdateCtrl
  $scope.updateNote = function(note) {
        console.log('note edited... can you hear it socket?');
        socket.emit('updateNote', note);
      };

  // Outgoing
  $scope.createNote = function() {
    // console.log("createNote called");
    var note = {
      id: new Date().getTime(),
      title: 'New Note',
      body: 'Pending'
    };

    $scope.notes.push(note);
    socket.emit('createNote', note);
  };

  $scope.deleteNote = function(id) {
    // console.log('note deleted... socket controller')
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

  filepicker.setKey("Af0l2C4KySEqLSsxUxWTjz");

  $scope.images = [];

  $scope.filepicker = function(){
    filepicker.pick(
      {
        mimetypes: ['image/*', 'text/plain'],
        container: 'window',
        services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
      },
      function(Blob){
        console.log("blob", JSON.stringify(Blob));
        $scope.images.push({ id: new Date().getTime(), url: Blob.url});
        console.log($scope.images);
        $scope.$digest();
      },
      function(FPError){
        console.log("fpe", FPError.toString());
      }
    )};



  // var file = element.files[0];

  // if (!file) {
  //   return;
  // }

  // var reader = new FileReader();
  // reader.onload = function () {
  //     scope.picPreview = this.result;
  //     scope.$apply();
  //   }
  // reader.readAsDataURL(file);


});


