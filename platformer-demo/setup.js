var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouseX, mouseY;
function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
		};
}
canvas.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		mouseX = mousePos.x;
		mouseY = mousePos.y;
}, false);    

var mousePressed = false;
canvas.onmousedown = function(e){
		mousePressed = true;
}
canvas.onmouseup = function(e){
		mousePressed = false;
}

var keys = [];

window.addEventListener('keydown',(e)=>{
  keys[e.keyCode]=true;
},false);
window.addEventListener('keyup',(e)=>{
  keys[e.keyCode]=false;
},false);



var width = canvas.width;
var height = canvas.height;

