//optionally hide sticks(supports), and points, make fixed points, add GUI
//fix loading disappearing

//window.onload = function(){
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


    var width = canvas.width;
    var height = canvas.height;
    
    var dampMouse = 0.1;
    var collision = 0.9;
    var friction = 0.999;
    var grav = 0.12;
    var rigid = 4;

    var points = [];
    points.push({
        x: 100,
        y: 100,
        oldX: 95+Math.random()*10-5,
        oldY: 95+Math.random()*10-5,
    });
    points.push({
        x: 200,
        y: 100,
        oldX: 195+Math.random()*10-5,
        oldY: 95+Math.random()*10-5,
    });    
    points.push({
        x: 200,
        y: 200,
        oldX: 201,
        oldY: 198,
    });    
    points.push({
        x: 100,
        y: 200,
        oldX: 95,
        oldY: 201,
    });
    points.push({
        x: 300,
        y: 300,
        oldX: 295,
        oldY: 305,
        locked: true,
    });


    points.push({
        x: 100,
        y: 100,
        oldX: 95+Math.random()*10-5,
        oldY: 95+Math.random()*10-5,
    });
    points.push({
        x: 200,
        y: 100,
        oldX: 195+Math.random()*10-5,
        oldY: 95+Math.random()*10-5,
    });    
    points.push({
        x: 200,
        y: 200,
        oldX: 201,
        oldY: 198,
    });    
    points.push({
        x: 100,
        y: 200,
        oldX: 95,
        oldY: 201,
    });
    points.push({
        x: 300,
        y: 300,
        oldX: 295,
        oldY: 305,
        locked: false,
    });
    
    


    var distance = function(p,p2){
        var dx = p2.x - p.x,
            dy = p2.y - p.y;
        return Math.sqrt(dx*dx+dy*dy);
    };
    var sticks = [];
    sticks.push({
        p: points[0],
        p2: points[1],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[1],
        p2: points[2],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[2],
        p2: points[3],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[3],
        p2: points[0],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[0],
        p2: points[2],
        length: 140,//distance(points[0],points[1]),
    });
    sticks.push({
        p: points[1],
        p2: points[3],
        length: 140,//distance(points[0],points[1]),
    });
    
    sticks.push({
        p: points[2],
        p2: points[4],
        length: 140,//distance(points[0],points[1]),
    });


    sticks.push({
        p: points[5],
        p2: points[6],
        length: distance(points[5],points[6]),
    });
    sticks.push({
        p: points[6],
        p2: points[7],
        length: distance(points[5],points[6]),
    });
    sticks.push({
        p: points[7],
        p2: points[8],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[8],
        p2: points[5],
        length: distance(points[0],points[1]),
    });
    sticks.push({
        p: points[5],
        p2: points[7],
        length: 140,//distance(points[0],points[1]),
    });
    sticks.push({
        p: points[6],
        p2: points[8],
        length: 140,//distance(points[0],points[1]),
    });
    
    sticks.push({
        p: points[7],
        p2: points[9],
        length: 140,//distance(points[0],points[1]),
    });
    
window.addEventListener('load', function() { 
    prompt("Loaded");
}, false);
window.requestAnimationFrame(gameLoop);
//}, false);
    



function gameLoop() {
    draw();
    updatePoints();
    for(var i = 0; i<rigid; i++){
        updateSticks();
        constrainPoints();
    }
    renderPoints();
    renderSticks();
    
    window.requestAnimationFrame(gameLoop);
}

var draw = function(){
    with(ctx){
        fillStyle = '#DCDCDC'
        fillRect(0, 0, width, height);
        
        fillStyle = 'green';
        fillRect(10,10,20,20);
    }
};
var updatePoints = function(){
    for(var i = 0; i<points.length; i++){
        var p = points[i];
        
        if(mousePressed&&i===0){
            var vx = (mouseX-p.x)*dampMouse;//0.1 smooth 0.9 immediate
            var vy = (mouseY-p.y)*dampMouse;
        }else{
            var vx = (p.x-p.oldX)*friction;
            var vy = (p.y-p.oldY)*friction;
        }
        
        
        p.oldX = p.x;
        p.oldY = p.y;
        
        if(!p.locked){
            p.x+=vx;
            p.y+=vy;
            p.y+=grav;
        }
    }
};
var constrainPoints = function(){
    for(var i = 0; i<points.length; i++){
        var p = points[i];
        
        var vx = (p.x-p.oldX)*friction;
        var vy = (p.y-p.oldY)*friction;
        
        if(p.x>width){
            p.x=width;
            p.oldX = p.x+vx*collision;
        }
        else if(p.x<0){
            p.x=0;
            p.oldX = p.x+vx*collision;
        }
        if(p.y>height){
            p.y=height;
            p.oldY = p.y+vy*collision;
        }
        else if(p.y<0){
            p.y=0;
            p.oldY = p.y+vy*collision;
        }
    }
};
var updateSticks = function(){
    for(var i = 0; i < sticks.length; i++) {
        var s = sticks[i],
            dx = s.p2.x - s.p.x,
            dy = s.p2.y - s.p.y,
            distance = Math.sqrt(dx * dx + dy * dy),
            difference = s.length - distance,
            percent = difference / distance / 2,
            offsetX = dx * percent,
            offsetY = dy * percent;

        if(!s.p.locked){
            s.p.x -= offsetX;
            s.p.y -= offsetY;
        }
        if(!s.p2.locked){
            s.p2.x += offsetX;
            s.p2.y += offsetY;
        }
    }
};
var renderPoints = function(){
    for(var i = 0; i<points.length; i++){
        var p = points[i];
        
        with(ctx){
            fillStyle = 'black';
            
            beginPath();
            arc(p.x, p.y, 5, 0, 2 * Math.PI);
            fillStyle = p.locked?'#ff0000' : '#0099b0';
            fill();
        }
        
    }
};
var renderSticks = function(){
    for(var i = 0; i<sticks.length; i++){
        var s = sticks[i];
        
        with(ctx){
            moveTo(s.p.x,s.p.y);
            lineTo(s.p2.x,s.p2.y);
            stroke();
        }
        
    }
};



