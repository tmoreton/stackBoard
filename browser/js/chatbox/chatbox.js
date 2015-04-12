'use strict';
app.directive('chatbox', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/chatbox/chatbox.html',
    controller: 'ChatCtrl'
  };
});

app.controller('ChatCtrl', function($scope, socket) {

  $scope.chatInput = '';
  $scope.messages = [];

  $scope.submitChat = function(message) {
       socket.emit('send message', message);
       console.log("chat sent");
       $scope.chatInput = '';
   };

  socket.on('chat message', function(data) {
    	$scope.messages.push(data);
    	console.log("chat received on front end", $scope.messages);
  });

});