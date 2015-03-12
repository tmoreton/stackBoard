app.directive('stickyNote', function(socketFactory){
  var linker = function(scope, element, attrs){
    element.draggable({
      stop: function(event, ui){
        socket.emit('moveNote', {
          id: scope.note.id,
          x: ui.postion.left,
          y: ui.position.top
        })
      }
    })
  }
})
