'use strict';
var socket = io.connect();

app.directive('draggableItem', function() {
  var linker = function(scope, element, attrs) {
      element.draggable({
        // start: function(event, ui) {
        //  socket.emit('moveNote', {
        //    id: scope.note.id,
        //    x: ui.position.left,
        //    y: ui.position.top
        //  });
        // },
        // drag: function(event, ui) {
        //  socket.emit('moveNote', {
        //    id: scope.note.id,
        //    x: ui.position.left,
        //    y: ui.position.top
        //  });
        // },
        stop: function(event, ui) {
          console.log("item", scope.item);
          console.log("item id", scope.item.id);
          socket.emit('moveItem', {
            id: scope.item.id,
            x: ui.position.left,
            y: ui.position.top
          });

        }
      });

      socket.on('onItemMoved', function(data) {
        // Update if the same item

          if(data.id == scope.item.id) {
            element.animate({
              left: data.x,
              top: data.y
            });
          };

      });

      // Some DOM initiation to make it nice
      element.css('left', '10px');
      element.css('top', '50px');
      element.hide().fadeIn();
    };



  return {
    restrict: 'A',
    link: linker,
    controller: 'UpdateCtrl',
    scope: {
      //this was note before. may need to change back if this updatectrl breaks
      item: '=',
      // ondelete: '&'
    }
  };
});

app.controller('UpdateCtrl', function($scope) {
      // Incoming
      socket.on('onItemUpdated', function(data) {
        console.log('item edited... socket listening');
        // Update if the same item
        $scope.$apply( function () {
          if(data.id == $scope.item.id) {
            $scope.item.title = data.title;
            $scope.item.body = data.body;
          }
        });
      });

      // Outgoing
      // $scope.updateNote = function(note) {
      //   console.log('note edited... can you hear it socket?');
      //   socket.emit('updateNote', note);
      // };

      // $scope.deleteNote = function(id) {
      //   console.log('note deleted... socket directive')
      //   $scope.ondelete({
      //     id: id
      //   });
      // };
  });


