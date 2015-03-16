'use strict';
var socket = io.connect();
var color;
var elem;

app.directive("drawing", function(){
  return {
    restrict: "A",
    link: function(scope, element){
      elem = element;
      var ctx = element[0].getContext('2d');
      ctx.canvas.width  = window.innerWidth;
      ctx.canvas.height = window.innerHeight;

      // variable that decides if something should be drawn on mousemove
      var drawing = false;

      // the last coordinates before the current move
      var lastX;
      var lastY;

      var currentX;
      var currentY;

      // var id = new Date().getTime();

      element.bind('mousedown', function(event){
        if(event.offsetX!==undefined){
          lastX = event.offsetX;
          lastY = event.offsetY;
        } else {
          lastX = event.layerX - event.currentTarget.offsetLeft;
          lastY = event.layerY - event.currentTarget.offsetTop;
        }

        // begins new line
        ctx.beginPath();

        drawing = true;
      });


      element.bind('mousemove', function(event){

        if(drawing){

            // get current mouse position
            if(event.offsetX!==undefined){
              currentX = event.offsetX;
              currentY = event.offsetY;
            } else {
              currentX = event.layerX - event.currentTarget.offsetLeft;
              currentY = event.layerY - event.currentTarget.offsetTop;
            }

            draw(lastX, lastY, currentX, currentY);

            socket.emit('mousemove', {
              lastX: lastX,
              lastY: lastY,
              currentX: currentX,
              currentY: currentY
            });
            // set current coordinates to last one
              lastX = currentX;
              lastY = currentY;
        }
      });

      socket.on('moving', function (data) {
        draw(data.lastX, data.lastY, data.currentX, data.currentY);
      });

      element.bind('mouseup', function(event){
        // stop drawing
        drawing = false;
      });

      function draw(lX, lY, cX, cY){
        console.log("color", color);
        // line from
        ctx.moveTo(lX,lY);
        // to
        ctx.lineTo(cX,cY);
        // color
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        // draw it
        ctx.stroke();
      }
    },
    controller: "DrawCtrl"
  };
});

app.controller("DrawCtrl", function($scope) {
  $scope.reset = function () {
       elem[0].width = elem[0].width;
      }

      color = "#ccc";

      $scope.changeColor = function () {
        console.log("change color");
        
          color = "#ff69b4";
          console.log("new color", color);
   
      }
})
