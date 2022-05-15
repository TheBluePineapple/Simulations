window.addEventListener('load', function() { 

}, false);
window.requestAnimationFrame(gameLoop);

function gameLoop() {
	draw();

	window.requestAnimationFrame(gameLoop);
}


var scene = "game";
var clicked = false;

var res = 40;
var level = 0;
var z = 20;
var levels = [
    [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,2,3,5,0,4,0,0,0],
        [1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [1,1,1,1,0,0,0,0,0,0,1,1,1,1],
        [1,5,5,5,5,0,0,0,0,0,0,0,4,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,5,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,0,0,0,5,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ],
];
var cam = {
    x: 0,
    y: 0,
};
var respawn = [200,200];

var rectCollide = function(obj1, obj2) {
        return obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x && obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y;
    };

//eventually only load on screen based on cam, do collisions here to
var showLevel = function(){
    
    //get current position based on camera 
    // var ypos = constrain(~~(cam.y/res+10)-5,0,9);
    // var xpos = constrain(~~(cam.x/res+10)-5,0,9);
    var ypos = ~~(cam.y/res+(z/2))-5;
    var xpos = ~~(cam.x/res+(z/2))-5;
    var yrel = (height/2)/res;
    var xrel = (width/2)/res;

    //levels[level].length    levels[level][i].length
    for(var i = Math.max(((ypos-yrel)),0); i<Math.min(((ypos+yrel))+1,levels[level].length); i++){
        for(var j = Math.max(((xpos-xrel)),0); j<Math.min(((xpos+xrel))+1,levels[level][i].length); j++){
            var x = j*res;
            var y = i*res;
            switch(levels[level][i][j]){
                case 0:
                    //empty
                    ctx.fillStyle = 'rgb(255,255,255)';
                break;
                case 1:   
                    // block
                    ctx.fillStyle = 'rgb(0,0,0)';
                break;
                case 2:   
                    //portal
                    ctx.fillStyle = 'rgb(200,200,0)';
                break;
                case 3:   
                    //lava
                    ctx.fillStyle = 'rgb(255,0,0)';
                break;
                case 4:   
                    //spawn point
                    respawn = [x,y];
                    ctx.fillStyle = 'rgb(0,0,255)';
                break;
                case 5:
                    //tramp
                    ctx.fillStyle = 'rgb(174,0,255)';
                break;
            }
            ctx.fillRect(x,y,res,res);
            
        }
    }
};


var Creature = function(x,y,w,h){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    
    this.dead = true;
    this.grav = 0.15;
    this.canJump = false;
    this.falling = true;
};
Creature.prototype.collide = function(vx,vy,block){
    for(var i = 0; i<levels[level].length; i++){
        for(var j = 0; j<levels[level][i].length; j++){
            var b = {
                x:j*res,
                y:i*res,
                w:res,
                h:res,
                type:levels[level][i][j]
            };    
            if(rectCollide(this,b)){
                switch(b.type){
                    case 0:
                        
                    break;
                    case 1:
                        if (vx > 0) {
                            this.x = b.x - this.w; //Sets x to the 37 of the block
                            this.vx = 0;
                            this.canJump = true;
                        }
                        if (vx < 0) {
                            this.x = b.x + b.w; //Sets x to the 39 of the block
                            this.vx = 0;
                            this.canJump = true;
                        }
                        if (vy > 0) {
                            this.y = b.y - this.h; //Sets y to the top of the block
                            this.vy = 0;
                            this.falling = false;
                            this.canJump = true;
                        }
                        if (vy < 0) {
                            this.y = b.y + b.h; //Sets y to the bottom of the block
                            this.vy = 0;
                            this.falling = true;
                            this.canJump = false;
                        }
                    break;
                    case 2:
                        level++;
                        this.dead=true;
                    break;
                    case 3:
                        this.dead=true;
                    break;
                    case 5:
                        this.vy=-7;
                    break;
                }
            }
        }
    }
    
};
Creature.prototype.run = function(){
    if (keys[37]) {
            this.vx -= 0.45;
        }
        if (keys[39]) {
            this.vx += 0.45;
        }
        if (keys[38] && this.canJump) {
            this.vy = -6;
            this.falling = true;
            this.canJump = false;
        }
        if (!keys[39] && !keys[37] || keys[39] && keys[37]) {
            if (Math.abs(this.vx) < 0.3) {
                this.vx = 0;
            } else {
                this.vx *= 0.9;
            }
        }
        this.vy += this.grav;
        if (this.vy > 0) {
            this.falling = true;
            this.canJump = false;
        }
				if(this.vx>4){this.vx=4;}
				if(this.vx<-4){this.vx=-4;}
        //this.vx = constrain(this.vx, -4, 4);
        // this.x = constrain(this.x, 0, width - this.w);
        this.x += this.vx;
        this.collide(this.vx, 0);
        this.y += this.vy;
        this.collide(0, this.vy);
        if (this.dead === true) {
            this.x = respawn[0];
            this.y = respawn[1];
            this.dead = false;
            this.vx = 0;
            this.vy = 0;
        }
};

var Player= function(x,y,w,h){
    Creature.call(this,x,y,w,h);
};
Player.prototype=Object.create(Creature.prototype);
Player.prototype.draw = function() {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(this.x,this.y,this.w,this.h);
};

var char = new Player(respawn[0],respawn[1],z,z);


var menu = function(){

};
var game = function(){
    cam.x += ((char.x+char.w/2)-cam.x-width/2)/10;
    cam.y += ((char.y+char.h/2)-cam.y-height/2)/10;
    ctx.translate(Math.round(-cam.x), Math.round(-cam.y));
    //ctx.stroke();
    showLevel();
    char.collide();
    char.run();
    char.draw();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
};
var how = function(){

};
var lead = function(){

};

draw= function() {
    ctx.fillStyle = 'rgb(220,220,220)';
	ctx.fillRect(0, 0, width, height);
    switch(scene){
        case 'menu':
            menu();
        break;
        case 'game':
            game();
        break;
        case 'how':
            how();
        break;
        
        case 'lead':
            lead();
        break;
    }
    ctx.fillStyle = 'rgb(255,0,0)';
};



// var draw = function(){

// 	with(ctx){
// 			// fillStyle = '#DCDCDC'
// 			fillStyle = 'rgb(255,255,255)';
// 			fillRect(0, 0, width, height);
			
// 			fillStyle = 'green';
// 			fillRect(10,10,20,20);
// 	}
// };