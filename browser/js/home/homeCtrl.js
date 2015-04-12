'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'js/home/home.html'
    });
});
 
app.controller('MainCtrl', function($scope, socket) {
  $scope.items = [];

  $scope.colorChange = {};
  $scope.boardReset = {};

  // Incoming
  socket.on('onItemCreated', function(data) {
      $scope.items.push(data);
      console.log($scope.items);
  });

  socket.on('onItemDeleted', function(data) {
      $scope.handleDeletedItem(data.id);
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
        $scope.$apply( function () {
          var pic = { id: new Date().getTime(), url: Blob.url, type: "image"}
          $scope.items.push(pic);
          socket.emit('createItem', pic);
          console.log($scope.items);
        });
      },
      function(FPError){
        console.log("fpe", FPError.toString());
      }
    )};

});


