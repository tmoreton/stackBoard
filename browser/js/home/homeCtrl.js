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
  $scope.items = [];

  $scope.colorChange = {};
  $scope.boardReset = {};

  // Incoming
  socket.on('onItemCreated', function(data) {
    $scope.$apply( function () {
      $scope.items.push(data);
      console.log($scope.items);
    });
  });

  socket.on('onItemDeleted', function(data) {
    $scope.$apply( function () {
      $scope.handleDeletedItem(data.id);
    });
  });

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  //moved this from the UpdateCtrl
  $scope.updateItem = function(item) {
        console.log('item edited... can you hear it socket?');
        socket.emit('updateItem', item);
      };

  // Outgoing
  $scope.createNote = function() {

    var item = {
      id: new Date().getTime(),
      type: "note",
      // title: 'New Note',
      // body: 'Pending'
    };

    $scope.items.push(item);
    socket.emit('createItem', item);
  };

  $scope.deleteItem = function(id) {
    console.log('item deleted... socket controller')
    $scope.handleDeletedItem(id);

    socket.emit('deleteItem', {id: id});
  };

  $scope.handleDeletedItem = function(id) {
    var oldItems = $scope.items,
    newItems = [];

    angular.forEach(oldItems, function(item) {
      if(item.id !== id) newItems.push(item);
    });

    $scope.items = newItems;
  }

  filepicker.setKey("Af0l2C4KySEqLSsxUxWTjz");

  $scope.createImage = function(){
    filepicker.pick(
      {
        mimetypes: ['image/*', 'text/plain'],
        container: 'window',
        services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
      },
      function(Blob){
        console.log("blob", JSON.stringify(Blob));
        //pushin into notes for now to check dragging functionality. need to rename
        $scope.$apply( function () {
          var pic = { id: new Date().getTime(), url: Blob.url, type: "image"}
          $scope.items.push(pic);
          socket.emit('createItem', pic);
          console.log($scope.items);
        });
        //$scope.$digest();
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


