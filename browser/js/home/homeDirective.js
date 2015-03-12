'use strict';
var socket = io.connect();

app.directive('stickyNote', function() {
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
          socket.emit('moveNote', {
            id: scope.note.id,
            x: ui.position.left,
            y: ui.position.top
          });
        }
      });

      socket.on('onNoteMoved', function(data) {
        // Update if the same note
        
          if(data.id == scope.note.id) {
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
      note: '=',
      // ondelete: '&'
    }
  };
});

app.controller('UpdateCtrl', function($scope) {
      // Incoming
      socket.on('onNoteUpdated', function(data) {
        console.log('note edited... socket listening');
        // Update if the same note
        $scope.$apply( function () {
          if(data.id == $scope.note.id) {
            $scope.note.title = data.title;
            $scope.note.body = data.body;
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
